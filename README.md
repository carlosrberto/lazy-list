[![Build Status](https://travis-ci.org/carlosrberto/lazy-list.svg?branch=master)](https://travis-ci.org/carlosrberto/lazy-list)
[![Coverage Status](https://coveralls.io/repos/github/carlosrberto/lazy-list/badge.svg?branch=master)](https://coveralls.io/github/carlosrberto/lazy-list?branch=master)

# LazyList

LazyList implements `map`, `filter` and `reduce` in JavaScript Arrays with lazy evaluation.

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
