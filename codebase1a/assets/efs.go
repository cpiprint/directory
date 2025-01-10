package assets

import (
	"embed"
)

//go:embed "emails" "templates" "static"
var EmbeddedFiles embed.FS
