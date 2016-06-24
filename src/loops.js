'use strict';

let forLoop = (initial, condition, update, thunk) => {
  initial();
  return _loop(condition, update, thunk);
};

let whileLoop = (condition, thunk) => {
  return _loop(condition, () => {}, thunk);
};

let _loop = (condition, update, thunk, value) => {
  return new Promise((resolve, reject) => {
    if(!condition()) {
      resolve(value);
    }
    else {
      return thunk()
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

let doWhileLoop = (condition, thunk) => {
  return _doLoop(condition, thunk);
};

let _doLoop = (condition, thunk) => {
  return new Promise((resolve, reject) => {
    return thunk()
      .then((value) => {
        if(!condition()) {
          resolve(value);
        }
        else {
          resolve(_doLoop(condition, thunk));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

let forEachLoop = (items, thunk) => {
  return _forEachLoop(items.slice(), thunk);
};

let _forEachLoop = (items, thunk, value) => {
  return new Promise((resolve, reject) => {
    if(items.length === 0) {
      resolve(value);
    }
    else {
      return thunk(items.shift())
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
