package database

import (
	"context"
	"github.com/jackc/pgx"
	"os"
	"strconv"
)

type Database interface {
	CreateVideoSegment(ctx context.Context, url string, originatingSourceVideoId *string) (*VideoSegmentRow, error)
	UpdateSourceVideoIsFullyUploaded(ctx context.Context, id string, value bool) error
}

type config struct {
	db *pgx.Conn
}

func NewDatabase() (Database, error) {
	// FIXME: handle errors
	port, _ := strconv.Atoi(os.Getenv("POSTGRES_PORT"))
	conn, _ := pgx.Connect(pgx.ConnConfig{
		Host:     os.Getenv("POSTGRES_HOST"),
		Port:     uint16(port),
		Password: os.Getenv("POSTGRES_PASSWORD"),
		Database: os.Getenv("POSTGRES_DB"),
	})
	return &config{
		db: conn,
	}, nil
}
