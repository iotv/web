package main

import (
	"context"
	"fmt"
	"testing"
)

func TestVerifyPasswordHash(t *testing.T) {
	fmt.Println(VerifyPasswordHash(context.Background(), VerifyPasswordHashEvent{Password: "test", PasswordHash: "$argon2id$v=19$m=524288,t=1,p=4$IOVZeCipRtXuwimPobgbKxhN0kPaLW9m6pnf1pV+o4DnBvgxtWeHRF4a1wCf1DgUeOk81tzmRgblX84nV96t6g$o5Umt0FVjWSuSWqq7o/VQR7wpEjTaliYvhOq9q/CzwLfc3maEvgVvKxiskNHnsW7cSsJEFeWwvnT5j2hbALm5g"}))
}
