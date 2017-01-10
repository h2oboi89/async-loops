'use strict';

/**
 * Note: only the `while` loop example is shown below,
 * but `loops.continue` will work for all loop types.
 */

const loops = require('../src/loops');

let i = 0;
let result = 0;

loops.while(
    // condition
    () => i < 10,
    // body
    () => {
      return new Promise((resolve, reject) => {
        if (i % 2 === 0) {
          i++;
          reject(loops.continue);
        } else {
          result = result + i++;
          resolve()
        }
      })
    })
  .then(() => {
    // 1 + 3 + 5 + 7 + 9 => 25
    console.log(result);
  });
