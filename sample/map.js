'use strict';

let loops = require('../src/loops');

loops.forEach( // items
    [1, 2, 3, 4, 5],
    // body
    (value, item) => Promise.resolve(item + 1),
    //  seed
    0)
  .then((value) => {
    // [ 2, 3, 4, 5, 6]
    console.log(value);
  });
