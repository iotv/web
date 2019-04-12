package main

import (
	"context"
	"fmt"
	"testing"
)

func TestCreatePasswordHash(t *testing.T) {
	fmt.Println(CreatePasswordHash(context.Background(), CreatePasswordHashEvent{Password: "test"}))
}
