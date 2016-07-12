'use strict';

let loops = require('../src/loops');

let i = 0;

loops.while(
    // condition
    () => true,
    // body
    (value) => {
      if(i < 10) {
        return Promise.resolve(value + i++);
      }
      else {
        // breaks out of while loop.
        // body resolves with value from last iteration
        return Promise.reject(loops.break);
      }
    },
    // seed (value for first iteration)
    0)
  .then((sum) => {
    // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 => 45
    console.log(sum);
  });
