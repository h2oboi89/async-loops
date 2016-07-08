'use strict';

let loops = require('../src/loops');

// items to iterate over
let items = [1, 1, 1, 1, 1];

// loop body, where we do all the work.
let body = (value, item, index, items) => {
  // modifying items modifies the original array
  items[index] = value;

  value = value + item;

  // resolved values are stored in a second array
  // that will be resolved at the end (see `result` below)
  return Promise.resolve(value);
};

// initial value passed into first iteration
let seed = 0;

loops.forEach(items, body, seed)
  .then((result) => {
    // original array (now modified)
    // [0, 1, 2, 3, 4]
    console.log(items);

    // resolved value
    // [1, 2, 3, 4, 5]
    console.log(result);
  });
