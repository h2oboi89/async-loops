'use strict';

const loops = require('../src/loops');

loops.reduce(
    //items
    [0, 1, 2, 3, 4, 5],
    // body
    (accumulator, item) => Promise.resolve(accumulator + item)
  )
  .then((value) => {
    // (0 + 1 + 2 + 3 + 4 + 5) => 15
    console.log(value);
  });
