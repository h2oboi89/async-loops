'use strict';

let loops = require('../src/loops');

let i = 0;

loops.while(
    // condition
    () => i < 10,
    // body
    (value) => Promise.resolve(value + i++),
    // seed (value for first iteration)
    0)
  .then((sum) => {
    // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 => 45
    console.log(sum);
  });
