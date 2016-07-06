'use strict';

let loops = require('../src/loops');

// we are mimicking a `while(true)`
let condition = () => true;

// loop body
let body = (value) => {
  value = value + value;

  if(value > 100) {
    // promise will resolve with value of last loop iteration
    // in essence, this iteration does not count
    return Promise.reject(loops.break);
  }
  else {
    return Promise.resolve(value);
  }
};

// initial value passed into first iteration
// (`value` in the body function)
let seed = 1;

loops.while(condition, body, seed)
  .then((sum) => {
    console.log(sum);
  });
