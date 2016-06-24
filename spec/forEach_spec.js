'use strict';

describe('for', () => {
  let utility = require('./utility.js');
  let loops = require('../src/loops.js');
  let mach = require('mach.js');

  let asyncTest = utility.asyncTest;
  let shouldResolve = utility.shouldResolve;
  let shouldReject = utility.shouldReject;
  let forEachLoop = loops.forEach;

  let thunk = mach.mockFunction('thunk');

  it('should not call the loop body if items is empty', asyncTest(() => {
    return shouldResolve(forEachLoop([], thunk));
  }));

  it('should reject if thunk rejects', asyncTest(() => {
    return thunk.shouldBeCalledWith(undefined, 0).andWillReturn(Promise.reject('oh noes!'))
      .when(() => {
        return shouldReject(forEachLoop([0, 1, 2, 3], thunk), 'oh noes!');
      });
  }));

  it('should resolve with the value thunk resolves with', asyncTest(() => {
    return thunk.shouldBeCalledWith(undefined, 0).andWillReturn(Promise.resolve(0))
      .then(thunk.shouldBeCalledWith(0, 1).andWillReturn(Promise.resolve(1)))
      .then(thunk.shouldBeCalledWith(1, 2).andWillReturn(Promise.resolve(2)))
      .then(thunk.shouldBeCalledWith(2, 3).andWillReturn(Promise.resolve(3)))
      .when(() => {
        return shouldResolve(forEachLoop([0, 1, 2, 3], thunk), 3);
      });
  }));

  it('should execute once for each item in the array', asyncTest(() => {
    let items = [0, 1, 2, 3];

    return thunk.shouldBeCalledWith(0, 0).andWillReturn(Promise.resolve(0))
      .then(thunk.shouldBeCalledWith(0, 1).andWillReturn(Promise.resolve(1)))
      .then(thunk.shouldBeCalledWith(1, 2).andWillReturn(Promise.resolve(3)))
      .then(thunk.shouldBeCalledWith(3, 3).andWillReturn(Promise.resolve(6)))
      .when(() => {
        return shouldResolve(forEachLoop(items, thunk, 0), 6);
      }).then(() => {
        expect(items).toEqual([0, 1, 2, 3]);
      });
  }));
});
