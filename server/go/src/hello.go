package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("Go Tickers Tutorial")
	// this creates a new ticker which will
	// `tick` every 1 second.
	ticker := time.NewTicker(1 * time.Second)

	// for every `tick` that our `ticker`
	// emits, we print `tock`
	for _ = range ticker.C {
		fmt.Println("tock")
	}
}
