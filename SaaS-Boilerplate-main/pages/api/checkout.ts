import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: '2024-04-10',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Handler called");

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (req.headers["stripe-signature"]) {
    console.log("Stripe signature found");

    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let stripeEvent: Stripe.Event;

    try {
      stripeEvent = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
      console.log("Stripe event constructed:", stripeEvent);
    } catch (err) {
      const error = err as Error;
      console.error("⚠️ Webhook signature verification failed.", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    console.log(`Handling Stripe event type: ${stripeEvent.type}`);
    switch (stripeEvent.type) {
      case "checkout.session.completed":
        console.log("Handling checkout.session.completed");
        await handleCheckoutSessionCompleted(stripeEvent);
        break;

      case "invoice.payment_succeeded":
        console.log("Handling invoice.payment_succeeded");
        await handleInvoicePaymentSucceeded(stripeEvent);
        break;

      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return res.status(200).json({ received: true });
  } else {
    console.log("No Stripe signature, handling checkout creation");
    try {
      await handleCheckoutCreation(req, res);
    } catch (error) {
      console.error("⚠️ Error handling checkout creation:", error);
      return res.status(400).json({ error: "Failed to create checkout session" });
    }
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const stripeSession = event.data.object as Stripe.Checkout.Session;

  console.log("Stripe session:", stripeSession);

  if (!stripeSession.subscription || !stripeSession.customer) {
    console.error("Stripe session data is incomplete.");
    return;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(stripeSession.subscription as string);
    console.log("Retrieved subscription:", subscription);

    const user = await db.user.findFirst({
      where: { stripeCustomerId: stripeSession.customer as string },
    });

    if (!user) {
      console.error("User not found for Stripe customer ID:", stripeSession.customer);
      return;
    }

    console.log("User found:", user);

    await db.user.update({
      where: { id: user.id },
      data: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        hasPaid: true,
      },
    });

    console.log("Updated user with subscription details");
  } catch (error) {
    console.error("Failed to update user with subscription details:", (error as Error).message);
  }
}

async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;

  console.log("Invoice:", invoice);

  try {
    const subscriptionId = invoice.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const user = await db.user.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
    });

    if (!user) {
      console.error("User not found for subscription ID:", subscriptionId);
      return;
    }

    console.log("User found:", user);

    await db.user.update({
      where: { id: user.id },
      data: {
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    console.log("Updated user with new subscription period end date");
  } catch (error) {
    console.error("Failed to update user with new subscription period end date:", (error as Error).message);
  }
}

async function handleCheckoutCreation(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Server session:", session);

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
      });
      stripeCustomerId = customer.id;
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1PS6GtAPpzV89AesFYQwxtij",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/canceled`,
    });

    console.log("Checkout session created:", checkoutSession);

    res.status(200).json({ url: checkoutSession.url });
  } catch (err) {
    const error = err as Error;
    console.error("Stripe error:", error.message);
    res.status(500).json({ statusCode: 500, message: error.message });
  }
}