'use strict';

let loops = require('../src/loops');

let i;

// initialize the loop variable
let initial = () => i = 0;

// condition on which loop should terminate
let condition = () => i < 10;

// update the loop variable after each iteration
let update = () => i++;

// loop body
let body = (value) => {
  return Promise.resolve(value + i);
};

// initial value passed into first iteration
// (`value` in the body function)
let seed = 0;

loops.for(initial, condition, update, body, seed)
  .then((result) => {
    // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 => 45
    console.log(result);
  });
