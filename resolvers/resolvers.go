package resolvers

import (
	"context"
	"gitlab.com/iotv/services/iotv-api/utilities"
	"gitlab.com/iotv/services/iotv-api/services/dynamodb"
)

type RootResolver struct{
	dynamoService dynamodb.Service
}

func (_ *RootResolver) Hello() string {
	return "world"
}

func (r *RootResolver) CreateUserWithPassword(ctx context.Context, args struct{ Email, Password, UserName string }) (*UserAuthContainer, error) {
	// FIXME: validate password/email
	hashedPassword, err := utilities.HashPassword(args.Password)
	if err != nil {
		// FIXME: make error more friendly
		return nil, err
	}

	if user, err := r.dynamoService.CreateUserWithEmailAndPassword(ctx, args.Email, args.UserName, *hashedPassword); err != nil {
		// Make sure error is friendly
		return nil, err
	} else {
		return &UserAuthContainer{
			userId: user.Id,

		}, nil
	}
	return nil, nil
}