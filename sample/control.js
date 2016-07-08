'use strict';

let loops = require('../src/loops');

// we are mimicking a `while(true)`
let condition = () => true;

let i = 0;

// loop body
let body = (value) => {
  value += (i++);

  if(value % 2 === 0) {
    // promise will stop execution and resolve value of the last loop iteration.
    return Promise.reject(loops.continue);
  }
  else if(value > 10) {
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
    // 1 + 3 + 3 => 7
    //
    // all iterations input: [1, 1, 1, 3, 3, 7, 7]
    // all iterations i:     [0, 1, 2, 3, 4, 5, 6]
    // value after line 12:  [1, 2, 3, 6, 7, 12, 13]
    // 2, 6, & 12 are rejected (mach.continue) because they are divisible by 2 (value % 2 === 0)
    // 13 is rejected (mach.break) because it is greater than 10
    console.log(sum);
  });
