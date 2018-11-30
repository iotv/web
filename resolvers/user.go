package resolvers

import (
	"context"
	"github.com/graph-gophers/graphql-go"
)

type User struct {
	r                *RootResolver
	id               string
	userName         string
	email            string
	isEmailConfirmed bool
	realName         *string
}

func (u *User) Id() graphql.ID {
	return graphql.ID(u.id)
}

func (u *User) UserName() string {
	return u.userName
}

func (u *User) IsEmailConfirmed() bool {
	return u.isEmailConfirmed
}

func (u *User) Email() string {
	return u.email
}

func (u *User) RealName() *string {
	return u.realName
}

func (r *RootResolver) GetUserById(ctx context.Context, id string) (*User, error) {
	if user, err := r.DynamoService.GetUserById(ctx, id); err != nil {
		return nil, err
	} else {
		return &User{
			r:        r,
			id:       user.UserId,
			userName: user.UserName,
			email:    user.Email,
			realName: user.RealName,
		}, nil
	}
}
