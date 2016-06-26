'use strict';

let loops = require('../src/loops');

// items to iterate over
let items = [0, 1, 2, 3, 4, 5];

// loop body, where we do all the work.
// in this case we are merely doing the equivalent of array.reduce
let body = (value, item, index) => {
  if(index === 0) {
    return Promise.resolve(item);
  }
  return Promise.resolve(value + item);
};

loops.forEach(items, body)
  .then((value) => {
    // [0, 1, 3, 6, 10, 15]
    console.log(value);
    // (0 + 1 + 2 + 3 + 4 + 5) => 15
    console.log(value[value.length - 1]);
  });
