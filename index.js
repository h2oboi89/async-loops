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
    if (!condition()) {
      resolve(value);
    } else {
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
}

let doWhileLoop = (condition, thunk) => {
  return _doLoop(condition, thunk);
};

let _doLoop = (condition, thunk, value) => {
  return new Promise((resolve, reject) => {
    return thunk()
      .then((v) => {
        if (!condition) {
          resolve(v);
        } else {
          resolve(_doLoop(condition, thunk, v));
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

let _forEachLoop = (items, thunk) => {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      resolve();
    } else {
      return thunk(items.shift())
        .then(() => {
          resolve(_forEachLoop(items, thunk));
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}

let async = {
  for: forLoop,
  while: whileLoop,
  doWhile: doWhileLoop,
  forEach: forEachLoop
}

console.log(async);

// Returns a random number between min (inclusive) and max (exclusive)
let getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
}

let thunk = () => {
  return new Promise((resolve, reject) => {
    if (i === 5) {
      reject('meh');
    } else if (getRandomArbitrary(0, 11) > 10) {
      reject('oh noes!');
    } else {
      resolve();
    }
  })
}

let i;

async.for(
    () => i = 0,
    () => i < 10,
    () => i++,
    () => new Promise((resolve, reject) => {
      process.stdout.write(i + ' ');

      return thunk()
        .catch((error) => {
          if (error !== 'meh') {
            reject(error);
          }
        })
        .then(() => {
          resolve();
        });
    }))
  .then(() => {
    console.log(`(${i} done)`);
  })
  .catch((error) => {
    console.log(error);
  });
