'use strict';

const loops = require('../src/loops');

loops.map( // items
    [1, 2, 3, 4, 5],
    // body
    (value, item) => Promise.resolve(item * 2))
  .then((value) => {
    // [ 2, 4, 6, 8, 10]
    console.log(value);
  });
