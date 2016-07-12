'use strict';

let loops = require('../src/loops');

loops.forEach(
    //items
    [0, 1, 2, 3, 4, 5],
    // body
    (value, item, index) => {
      if(index === 0) {
        return Promise.resolve(item);
      }
      return Promise.resolve(value + item);
    })
  .then((value) => {
    // [0, 1, 3, 6, 10, 15]
    console.log(value);
    // (0 + 1 + 2 + 3 + 4 + 5) => 15
    console.log(value[value.length - 1]);
  });
