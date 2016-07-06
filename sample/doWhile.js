'use strict';

let loops = require('../src/loops');

let i = 100;

// checked after execution of the loop body
let condition = () => i < 0;

// loop body
let body = (value) => {
  return Promise.resolve(value * i);
};

// initial value passed into first iteration
// (`value` in the body function)
let seed = -1;

loops.doWhile(condition, body, seed)
  .then((sum) => {
    console.log(sum);
  });
