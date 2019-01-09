package resolvers

import (
	"context"
	"errors"
	"gitlab.com/iotv/services/iotv-api/services/dynamodb"
	"gitlab.com/iotv/services/iotv-api/services/s3"
	userSvc "gitlab.com/iotv/services/iotv-api/services/user"
	"gitlab.com/iotv/services/iotv-api/utilities"
)

var (
	InvalidEmailOrPasswordError = errors.New("invalid email/password")
)

type RootResolver struct {
	UserService     userSvc.Service
	DynamoDBService dynamodb.Service
	S3Service       s3.Service
}

func (r *RootResolver) CreateUserWithPassword(ctx context.Context, args struct{ Email, Password, UserName string }) (*UserAuthContainer, error) {
	if err := utilities.ValidateEmailString(args.Email); err != nil {
		return nil, err
	}

	if err := utilities.ValidatePasswordPolicy(args.Password); err != nil {
		return nil, err
	}

	hashedPassword, err := utilities.HashPassword(args.Password)
	if err != nil {
		// FIXME: make error more friendly
		return nil, err
	}

	if newUser, err := r.UserService.CreateUserWithEmailAndPassword(ctx, args.Email, args.UserName, *hashedPassword); err != nil {
		// FIXME Make sure error is friendly
		return nil, err
	} else {
		if token, err := utilities.SignJWT(newUser.UserId); err != nil {
			// FIXME: make error friendly
			return nil, err
		} else {
			return &UserAuthContainer{
				r:      r,
				token:  token,
				userId: newUser.UserId,
			}, nil
		}
	}
}

func (r *RootResolver) LoginWithEmailAndPassword(ctx context.Context, args struct{ Email, Password string }) (*UserAuthContainer, error) {
	// Some extra effort is made here to make it harder for attackers to perform a user-enumeration attack
	// Login utilizes the following safety variable to continue through validation at the same pace even when it is known that the auth will fail
	var isPossiblyValid = true

	auth, err := r.UserService.GetEmailAuthenticationByEmail(ctx, args.Email)
	if err != nil {
		// Create a fake auth which will fail validation, so that the rest of this function executes in the same amount of time as an incorrect password
		auth = &userSvc.EmailAuthentication{
			HashedPassword: utilities.InvalidEncodedPassword,
		}
		// Set our safety to prevent accidentally succeeding even though it shouldn't ever.
		isPossiblyValid = false
	}

	// Check that either the real password hash matches or the fake one matches
	// Fake should never match, but in the case of a bug, fall back onto the safety
	if err := utilities.ValidatePassword(args.Password, auth.HashedPassword); err != nil {
		return nil, InvalidEmailOrPasswordError
	}

	if token, err := utilities.SignJWT(auth.UserId); err != nil {
		return nil, err
	} else {
		// Ensure the safety isn't broken. This should never be false at this point, but check anyways
		if isPossiblyValid {
			return &UserAuthContainer{
				r:      r,
				token:  token,
				userId: auth.UserId,
			}, nil
		} else {
			return nil, InvalidEmailOrPasswordError
		}
	}
}

func (r *RootResolver) Me(ctx context.Context) (*User, error) {
	if userId, err := utilities.GetUserIdFromContextJwt(ctx); err != nil {
		return nil, err
	} else {
		return r.GetUserById(ctx, userId)
	}
}
