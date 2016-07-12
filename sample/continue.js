'use strict';

let loops = require('../src/loops');

let i = 0;

loops.while(
    // condition
    () => i < 10,
    // body
    (value) => Promise.resolve(value + i)
    .then((value) => {
      if(i++ % 2 === 0) {
        // `skips` this iteration of while loop.
        // body resolves with value from last iteration
        throw loops.continue;
      }
      else {
        return value;
      }
    }),
    // seed (value for first iteration)
    0)
  .then((sum) => {
    // 1 + 3 + 5 + 7 + 9 => 25
    console.log(sum);
  });
