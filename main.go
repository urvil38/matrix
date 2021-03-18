package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

func getEnv(env string, def string) string {
	val, ok := os.LookupEnv(env)
	if !ok {
		return def
	}
	return val
}

func main() {
	port := getEnv("PORT", "5000")

	log.Println("server is running on port:", port)
	r := mux.NewRouter()

	staticHandler := http.FileServer(http.Dir("static"))
	r.PathPrefix("/static/").Handler(loggingHandler(noCache(http.StripPrefix("/static/", staticHandler))))

	r.Handle("/", loggingHandler(staticHandler))

	srv := &http.Server{
		Handler: r,
		Addr:    ":" + port,
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	if err := srv.ListenAndServe(); err != nil {
		log.Println(err)
	}
}

func noCache(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache, private, max-age=0")
		h.ServeHTTP(w, r)
	})
}
