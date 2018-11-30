package logger

type Logger interface {
}

type config struct {
}

func NewLogger() Logger {
	return &config{}
}
