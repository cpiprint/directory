package main

import (
	"net/http"

	"cpi.module.path/assets"

	"github.com/alexedwards/flow"
)

func (app *application) routes() http.Handler {
	mux := flow.New()
	mux.NotFound = http.HandlerFunc(app.notFound)

	mux.Use(app.recoverPanic)
	mux.Use(app.securityHeaders)

	fileServer := http.FileServer(http.FS(assets.EmbeddedFiles))
	mux.Handle("/static/...", fileServer, "GET")

	mux.HandleFunc("/", app.home, "GET")

	mux.Group(func(mux *flow.Mux) {
		mux.Use(app.requireBasicAuthentication)

		mux.HandleFunc("/basic-auth-protected", app.protected, "GET")
	})

	return mux
}
