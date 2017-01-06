'use strict';

const loops = require('../src/loops');

let i = 0;
let result = 0;

// only difference between `while` and `doWhile` is that a whiles condition is
// checked *BEFORE* running body while a doWhiles is checked *AFTER*.
loops.doWhile(
    // condition
    () => i < 10,
    // body
    () => {
      result = result + i++;
      return Promise.resolve();
    })
  .then(() => {
    // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 => 45
    console.log(result);
  });
