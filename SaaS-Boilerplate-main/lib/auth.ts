import { db } from '../lib/db'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextAuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback triggered');
        const dbUser = await db.user.findFirst({
          where: { email: user.email },
        });

        if (!dbUser) {
          console.log('Creating new user in the database');
          const newUser = await db.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
            },
          });
          token.id = newUser.id;
        } else {
          console.log('User found in the database:', dbUser);
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
      }

      return token;
    },

    async signIn({ account, profile }) {
      console.log('SignIn callback triggered');
      if (account && account.provider === 'google' && profile) {
        const dbUser = await db.user.findFirst({
          where: { email: profile.email },
        });

        if (dbUser) {
          console.log('Linking Google account to existing user:', dbUser.id);
          await db.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {},
            create: {
              userId: dbUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token || null,
              type: 'oauth',
            },
          });
        } else {
          console.log('No user found with this email:', profile.email);
        }
      } else {
        console.log('No account or profile information available');
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Ensure that the redirect only happens after sign in
      if (url.startsWith(baseUrl)) {
        return '/dashboard'; // Redirect to dashboard after login
      }
      return url; // Allow redirect to other URLs if needed
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
