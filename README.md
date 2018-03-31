# LazyList

LazyList implements `map`, `filter` and `reduce` in JavaScript Arrays with lazy evaluation.

>**Warning**: This project  is under initial development and is not intended to production use yet.

## Why?
Because `map`, `filter` and `reduce` operations always return a new `Array` or depends on previous operations. When working with large lists this can be a problem. What LazyList do is combine all these operations in a single execution, returning only one final `Array` or result.

## Usage

```javascript
import lazy from 'lazy-list';

const list = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10];
const mapped = lazy(list)
  .filter(v => v > 4)
  .map(v => v * 2);

// filter and map returns a LazyList Object
// use LazyList.value() to get the result
console.log(mapped.value()); // [10, 12, 14, 18, 20]

// LazyList.reduce will execute all previous operations
// and return the result
const sum = mapped.reduce((a, b) => a + b);
console.log(sum); // 74
```
