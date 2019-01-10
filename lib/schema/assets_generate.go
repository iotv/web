// +build ignore

package main

import (
	"log"

	"github.com/shurcooL/vfsgen"
	"gitlab.com/iotv/services/iotv-api/schema"
)

func main() {
	err := vfsgen.Generate(schema.Assets, vfsgen.Options{
		PackageName:  "schema",
		BuildTags:    "!dev",
		VariableName: "Assets",
	})
	if err != nil {
		log.Fatalln(err)
	}
}