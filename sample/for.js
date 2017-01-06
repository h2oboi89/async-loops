'use strict';

const loops = require('../src/loops');

let i;
let result = 0;

loops.for(
    // initialize
    () => i = 0,
    // condition
    () => i < 10,
    // update
    () => i++,
    // body
    () => {
      result = result + i;
      return Promise.resolve();
    })
  .then(() => {
    // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 => 45
    console.log(result);
  });
