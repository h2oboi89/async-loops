'use strict';

let loops = require('../src/loops');

// items to iterate over
let items = [1, 2, 3, 4, 5];

// loop body, where we do all the work.
// in this case we are merely doing the equivalent of array.map
let body = (value, item) => {
  return Promise.resolve(item + 1);
};

// initial value passed into first iteration
let seed = 0;

loops.forEach(items, body, seed)
  .then((value) => {
    // [ 2, 3, 4, 5, 6]
    console.log(value);
  });
