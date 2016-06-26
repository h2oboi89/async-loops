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
          reject(error);
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
        reject(error);
      });
  });
};

/**
 * Asynchronous `forEach` loop.
 * The initial iteration is passed the `seed` value and an item from `items`.
 * Subsequent iterations get passed the resolved value from the last iteration
 * and the next item from `items`.
 * @function forEach
 * @param {object[]} items Collection to iterator over.
 * @param {function} thunk Loop body. Returns a Promise and accepts a value.
 * @param {object} [seed] Initial value to be passed to first loop iteration.
 */
let forEachLoop = (items, thunk, seed) => {
  return _forEachLoop(items.slice(), thunk, 0, seed);
};

let _forEachLoop = (items, thunk, index, value) => {
  return new Promise((resolve, reject) => {
    if(index === items.length) {
      resolve(items);
    }
    else {
      return thunk(value, items[index], index, items)
        .then((v) => {
          items[index] = v;
          resolve(_forEachLoop(items, thunk, index + 1, v));
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

module.exports = {
  for: forLoop,
  while: whileLoop,
  doWhile: doWhileLoop,
  forEach: forEachLoop
};
