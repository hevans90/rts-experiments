Some SQRT algorithm using Newton's method:

```go
package main

import (
	"fmt"
)

func Sqrt(x float64) float64 {
	accuracy := 1e-10
	seed := 1.0
	z := seed
	for i := 0; i < 1000; i++ {
		temp := z
		z -= (z*z - x) / (2 * z)

		if i > 0 && temp-z < accuracy {
			fmt.Println("initial z value:", seed)
			fmt.Println("converged in:", i, "loops \n")
			break
		}
	}
	return z
}

func main() {
	fmt.Println(Sqrt(2))
}
```
