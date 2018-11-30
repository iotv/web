// +build dev

package schema

import "net/http"

var Assets http.FileSystem = http.Dir("graphql")