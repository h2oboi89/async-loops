'use strict';

let loops = require('../src/loops');

let i;

loops.for(
    // initialize
    () => i = 0,
    // condition
    () => i < 10,
    // update
    () => i++,
    // body
    (value) => Promise.resolve(value + i),
    // seed (value for first iteration)
    0)
  .then((result) => {
    // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 => 45
    console.log(result);
  });
