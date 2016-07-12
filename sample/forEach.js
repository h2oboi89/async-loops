'use strict';

let loops = require('../src/loops');

loops.forEach(
    // items
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    // body
    (value, item) => Promise.resolve(value + item),
    // seed
    0
  )
  .then((result) => {
    // [0, 1, 3, 6, 10, 15, 21, 28, 36, 45]
    console.log(result);
  });
