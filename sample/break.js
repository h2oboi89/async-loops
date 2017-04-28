'use strict';

/**
 * Note: only the `while` loop example is shown below,
 * but `loops.break` will work for all loop types.
 */

const loops = require('../src/loops');

let i = 0;

let result = 0;

loops.while(
    // condition
    () => true,
    // body
    () => {
      return new Promise((resolve, reject) => {
        if(i < 10) {
          result = result + i++;
          resolve();
        }
        else {
          // breaks out of while loop.
          reject(loops.break);
        }
      });
    })
  .then(() => {
    // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 => 45
    console.log(result);
  });
