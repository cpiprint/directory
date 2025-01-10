package main

import (
	"log/slog"
	"net/http"
	"runtime/debug"

	"cpi.module.path/internal/response"
)

func (app *application) reportServerError(r *http.Request, err error) {
	var (
		message = err.Error()
		method  = r.Method
		url     = r.URL.String()
		trace   = string(debug.Stack())
	)

	requestAttrs := slog.Group("request", "method", method, "url", url)
	app.logger.Error(message, requestAttrs, "trace", trace)
}

func (app *application) serverError(w http.ResponseWriter, r *http.Request, err error) {
	app.reportServerError(r, err)

	data := app.newTemplateData(r)

	err = response.Page(w, http.StatusInternalServerError, data, "pages/errors/500.tmpl")
	if err != nil {
		app.reportServerError(r, err)

		message := "The server encountered a problem and could not process your request"
		http.Error(w, message, http.StatusInternalServerError)
	}
}

func (app *application) notFound(w http.ResponseWriter, r *http.Request) {
	data := app.newTemplateData(r)

	err := response.Page(w, http.StatusNotFound, data, "pages/errors/404.tmpl")
	if err != nil {
		app.serverError(w, r, err)
	}
}

func (app *application) badRequest(w http.ResponseWriter, r *http.Request, err error) {
	data := app.newTemplateData(r)
	data["ErrorMessage"] = err.Error()

	err = response.Page(w, http.StatusBadRequest, data, "pages/errors/400.tmpl")
	if err != nil {
		app.serverError(w, r, err)
	}
}

func (app *application) basicAuthenticationRequired(w http.ResponseWriter, r *http.Request) {
	data := app.newTemplateData(r)

	headers := make(http.Header)
	headers.Set("WWW-Authenticate", `Basic realm="restricted", charset="UTF-8"`)

	err := response.PageWithHeaders(w, http.StatusUnauthorized, data, headers, "pages/errors/401.tmpl")
	if err != nil {
		app.serverError(w, r, err)
	}
}
