package resolvers

import (
	"context"
)

type UserAuthContainer struct {
	token  string
	userId string
}

func (u *UserAuthContainer) Token(ctx context.Context) string {
	return u.token
}

