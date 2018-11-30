package resolvers

import (
	"context"
	"gitlab.com/iotv/services/iotv-api/services/dynamodb"
	"gitlab.com/iotv/services/iotv-api/utilities"
)

type RootResolver struct {
	DynamoService dynamodb.Service
}


func (r *RootResolver) CreateUserWithPassword(ctx context.Context, args struct{ Email, Password, UserName string }) (*UserAuthContainer, error) {
	// FIXME: validate password/email
	hashedPassword, err := utilities.HashPassword(args.Password)
	if err != nil {
		// FIXME: make error more friendly
		return nil, err
	}

	if user, err := r.DynamoService.CreateUserWithEmailAndPassword(ctx, args.Email, args.UserName, *hashedPassword); err != nil {
		// FIXME Make sure error is friendly
		return nil, err
	} else {
		if token, err := utilities.SignJWT(user.UserId); err != nil {
			// FIXME: make error friendly
			return nil, err
		} else {
			return &UserAuthContainer{
				r:      r,
				token:  token,
				userId: user.UserId,
			}, nil
		}
	}
}

func (r *RootResolver) LoginWithEmailAndPassword(ctx context.Context, args struct{ Email, Password string }) (*UserAuthContainer, error) {
	return nil, nil
}
