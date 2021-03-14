package main

import (
	"log"
	"net/http"
)

type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func remoteAddr(r *http.Request) string {
	addr := r.RemoteAddr

	if r.Header.Get("x-forwarded-for") != "" {
		addr = r.Header.Get("x-forwarded-for")
	}

	return addr
}

func loggingHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lrw := newLoggingResponseWriter(w)
		h.ServeHTTP(lrw, r)
		log.Printf("- %v - [%v] %v - \"%v\"\n", remoteAddr(r), r.Method, lrw.statusCode, r.URL)
	})
}

func newLoggingResponseWriter(w http.ResponseWriter) *loggingResponseWriter {
	// WriteHeader(int) is not called if our response implicitly returns 200 OK, so
	// we default to that status code.
	return &loggingResponseWriter{w, http.StatusOK}
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}
