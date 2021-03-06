'use strict';

/**
 * Asynchronous `for` loop.
 * @function for
 * @param {function} initial Sets up initial condition for loop. ie: `() => i = 0`
 * @param {function} condition Checks whether loop body should be executed. ie: `() => i < 10`
 * @param {function} update Executes after the loop body. ie: `() => i++`
 * @param {function} thunk Loop body. Returns a Promise.
 * @returns {Promise} Resolves if successful; otherwise rejects with error.
 */
let forLoop = (initial, condition, update, thunk) => {
  initial();
  return _loop(condition, update, thunk);
};

/**
 * Asynchronous `while` loop.
 * @function while
 * @param {function} condition Checks whether loop body should be executed. ie: `() => i < 10`
 * @param {function} thunk Loop body. Returns a Promise.
 * @returns {Promise} Resolves if successful; otherwise rejects with error.
 */
let whileLoop = (condition, thunk) => {
  return _loop(condition, () => {}, thunk);
};

let _loop = (condition, update, thunk) => {
  return new Promise((resolve, reject) => {
    if(!condition()) {
      resolve();
    }
    else {
      thunk()
        .then(() => {
          update();
          return _loop(condition, update, thunk).then(resolve);
        })
        .catch((error) => {
          switch(error) {
            case BREAK_ERROR:
              resolve();
              break;
            case CONTINUE_ERROR:
              update();
              return _loop(condition, update, thunk).then(resolve);
            default:
              reject(error);
          }
        });
    }
  });
};

/**
 * Asynchronous `doWhile` loop.
 * @function doWhile
 * @param {function} condition Checks whether loop should continue or quit. ie: `() => i < 10`
 * @param {function} thunk Loop body. Returns a Promise.
 * @returns {Promise} Resolves if successful; otherwise rejects with error.
 */
let doWhileLoop = (condition, thunk) => {
  return _doLoop(condition, thunk);
};

let _doLoop = (condition, thunk) => {
  return new Promise((resolve, reject) => {
    thunk()
      .then(() => {
        if(!condition()) {
          resolve();
        }
        else {
          return _doLoop(condition, thunk).then(resolve);
        }
      })
      .catch((error) => {
        switch(error) {
          case BREAK_ERROR:
            resolve();
            break;
          case CONTINUE_ERROR:
            if(!condition()) {
              resolve();
            }
            else {
              return _doLoop(condition, thunk).then(resolve);
            }
            break;
          default:
            reject(error);
        }
      });
  });
};

/**
 * Asynchronous `map`.
 * Each iteration is passed a the following: `(items[index], index, items)`.
 * Thunk should resolve a value, which will be stored in array that is built up each iteration.
 * Index starts at 0 and is incremented each iteration.
 * NOTE: modifying `items` will impact subsequent iterations.
 * @function map
 * @param {object[]} items Collection to iterator over.
 * @param {function} thunk Loop body. Returns a Promise.
 * @returns {Promise} Resolves with array of values if successful; otherwise rejects with error.
 */
const mapLoop = (items, thunk) => {
  return _mapLoop(items, thunk, 0, items.slice());
};

const _mapLoop = (items, thunk, index, result) => {
  return new Promise((resolve, reject) => {
    if(index >= items.length) {
      resolve(result);
    }
    else {
      thunk(items[index], index, items)
        .then((v) => {
          result[index] = v;
          return _mapLoop(items, thunk, index + 1, result).then(resolve);
        })
        .catch((error) => {
          switch(error) {
            case BREAK_ERROR:
              resolve(result);
              break;
            case CONTINUE_ERROR:
              return _mapLoop(items, thunk, index + 1, result).then(resolve);
            default:
              reject(error);
          }
        });
    }
  });
};

/**
 * Asynchronous `reduce`.
 * Each iteration is passed a the following: `(accumulator, items[index], index, items)`.
 * Thunk should resolve a value, which is used as `accumulator` input for next iteration.
 * Index starts at 0 and is incremented each iteration.
 * NOTE: modifying `items` will impact subsequent iterations.
 * @function reduce
 * @param {object[]} items Collection to iterator over.
 * @param {function} thunk Loop body. Returns a Promise and accepts a value.
 * @param {object|number} [initialValue = 0] Initial value for accumulator.
 * @returns {Promise} Resolves with reduced value if successful; otherwise rejects with error.
 */
const reduceLoop = (items, thunk, initialValue) => {
  return _reduceLoop(items, thunk, 0, initialValue || 0);
};

const _reduceLoop = (items, thunk, index, accumulator) => {
  return new Promise((resolve, reject) => {
    if(index >= items.length) {
      resolve(accumulator);
    }
    else {
      thunk(accumulator, items[index], index, items)
        .then((v) => {
          return _reduceLoop(items, thunk, index + 1, v).then(resolve);
        })
        .catch((error) => {
          switch(error) {
            case BREAK_ERROR:
              resolve(accumulator);
              break;
            case CONTINUE_ERROR:
              return _reduceLoop(items, thunk, index + 1, accumulator).then(resolve);
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
  map: mapLoop,
  reduce: reduceLoop,
  break: BREAK_ERROR,
  continue: CONTINUE_ERROR
};
