'use strict';

/**
 * Asynchronous `for` loop.
 * The initial iteration is passed the `seed` value.
 * Subsequent iterations get passed the resolved value from the last iteration.
 * @function for
 * @param {function} initial Sets up initial condition for loop. ie: `() => i = 0`
 * @param {function} condition Checks whether loop body should be executed. ie: `() => i < 10`
 * @param {function} update Executes after the loop body. ie: `() => i++`
 * @param {function} thunk Loop body. Returns a Promise and accepts a value.
 * @param {object} [seed] Initial value to be passed to first loop iteration.
 * @returns {object} Resolves with final resolved value.
 */
let forLoop = (initial, condition, update, thunk, seed) => {
  initial();
  return _loop(condition, update, thunk, seed);
};

/**
 * Asynchronous `while` loop.
 * The initial iteration is passed the `seed` value.
 * Subsequent iterations get passed the resolved value from the last iteration.
 * @function while
 * @param {function} condition Checks whether loop body should be executed. ie: `() => i < 10`
 * @param {function} thunk Loop body. Returns a Promise and accepts a value.
 * @param {object} [seed] Initial value to be passed to first loop iteration.
 * @returns {object} Resolves with final resolved value.
 */
let whileLoop = (condition, thunk, seed) => {
  return _loop(condition, () => {}, thunk, seed);
};

let _loop = (condition, update, thunk, value) => {
  return new Promise((resolve, reject) => {
    if(!condition()) {
      resolve(value);
    }
    else {
      return thunk(value)
        .then((v) => {
          update();
          resolve(_loop(condition, update, thunk, v));
        })
        .catch((error) => {
          switch(error) {
            case BREAK_ERROR:
              resolve(value);
              break;
            case CONTINUE_ERROR:
              update();
              resolve(_loop(condition, update, thunk, value));
              break;
            default:
              reject(error);
          }
        });
    }
  });
};

/**
 * Asynchronous `doWhile` loop.
 * The initial iteration is passed the `seed` value.
 * Subsequent iterations get passed the resolved value from the last iteration.
 * @function doWhile
 * @param {function} condition Checks whether loop should continue or quit. ie: `() => i < 10`
 * @param {function} thunk Loop body. Returns a Promise and accepts a value.
 * @param {object} [seed] Initial value to be passed to first loop iteration.
 * @returns {object} Resolves with final resolved value.
 */
let doWhileLoop = (condition, thunk, seed) => {
  return _doLoop(condition, thunk, seed);
};

let _doLoop = (condition, thunk, value) => {
  return new Promise((resolve, reject) => {
    return thunk(value)
      .then((v) => {
        if(!condition()) {
          resolve(v);
        }
        else {
          resolve(_doLoop(condition, thunk, v));
        }
      })
      .catch((error) => {
        switch(error) {
          case BREAK_ERROR:
            resolve(value);
            break;
          case CONTINUE_ERROR:
            if(!condition()) {
              resolve(value);
            }
            else {
              resolve(_doLoop(condition, thunk, value));
            }
            break;
          default:
            reject(error);
        }
      });
  });
};

/**
 * Asynchronous `forEach` loop.
 * Each iteration is passed a the following: `(value, items[index], index, items)`.
 * For the first iteration the value is the `seed` value.
 * Subsequent iterations get the resolved value from the previous iteration.
 * Index starts at 0 and is incremented each iteration.
 * NOTE: modifying `items` will impact subsequent iterations.
 * @function forEach
 * @param {object[]} items Collection to iterator over.
 * @param {function} thunk Loop body. Returns a Promise and accepts a value.
 * @param {object} [seed] Initial value to be passed to first loop iteration.
 * @returns {object[]} Resolves with array containing resolved values from each iteration.
 */
let forEachLoop = (items, thunk, seed) => {
  return _forEachLoop(items, thunk, 0, seed, items.slice());
};

let _forEachLoop = (items, thunk, index, value, result) => {
  return new Promise((resolve, reject) => {
    if(index >= items.length) {
      resolve(result);
    }
    else {
      return thunk(value, items[index], index, items)
        .then((v) => {
          result[index] = v;
          resolve(_forEachLoop(items, thunk, index + 1, v, result));
        })
        .catch((error) => {
          switch(error) {
            case BREAK_ERROR:
              resolve(result);
              break;
            case CONTINUE_ERROR:
              result[index] = value;
              resolve(_forEachLoop(items, thunk, index + 1, value, result));
              break;
            default:
              reject(error);
          }
        });
    }
  });
};

const BREAK_ERROR = 'ASYNC_LOOPS_BREAK';
const CONTINUE_ERROR = 'ASYNC_LOOPS_CONTINUE';

module.exports = {
  for: forLoop,
  while: whileLoop,
  doWhile: doWhileLoop,
  forEach: forEachLoop,
  break: BREAK_ERROR,
  continue: CONTINUE_ERROR
};
