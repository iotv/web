package resolvers

import (
	"context"
)

type UserAuthContainer struct {
	r      *RootResolver
	token  string
	userId string
}

func (u *UserAuthContainer) Token(ctx context.Context) string {
	return u.token
}

func (u *UserAuthContainer) User(ctx context.Context) (*User, error) {
	return u.r.GetUserById(ctx, u.userId)
}
