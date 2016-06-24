'use strict';

let forLoop = (initial, condition, update, thunk, seed) => {
  initial();
  return _loop(condition, update, thunk, seed);
};

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

let forEachLoop = (items, thunk, seed) => {
  return _forEachLoop(items.slice(), thunk, seed);
};

let _forEachLoop = (items, thunk, value) => {
  return new Promise((resolve, reject) => {
    if(items.length === 0) {
      resolve(value);
    }
    else {
      return thunk(value, items.shift())
        .then((v) => {
          resolve(_forEachLoop(items, thunk, v));
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
