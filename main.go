package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

func getEnv(env string) string {
	e := os.Getenv(env)
	return e
}

func main() {
	port := getEnv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Println("server is running on port:", port)
	r := mux.NewRouter()

	staticHandler := http.FileServer(http.Dir("static"))
	r.PathPrefix("/static/").Handler(loggingHandler(http.StripPrefix("/static/", staticHandler)))

	r.Handle("/", loggingHandler(staticHandler))

	srv := &http.Server{
		Handler: r,
		Addr:    ":"+port,
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	if err := srv.ListenAndServe(); err != nil {
		log.Println(err)
	}
}
