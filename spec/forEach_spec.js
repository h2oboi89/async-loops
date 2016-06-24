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
    return thunk.shouldBeCalledWith(0).andWillReturn(Promise.reject('oh noes!'))
      .when(() => {
        return shouldReject(forEachLoop([0, 1, 2, 3], thunk), 'oh noes!');
      });
  }));

  it('should resolve with the value thunk resolves with', asyncTest(() => {
    return thunk.shouldBeCalledWith(0).andWillReturn(Promise.resolve())
      .then(thunk.shouldBeCalledWith(1).andWillReturn(Promise.resolve()))
      .then(thunk.shouldBeCalledWith(2).andWillReturn(Promise.resolve()))
      .then(thunk.shouldBeCalledWith(3).andWillReturn(Promise.resolve(1)))
      .when(() => {
        return shouldResolve(forEachLoop([0, 1, 2, 3], thunk), 1);
      });
  }));

  it('should execute once for each item in the array', asyncTest(() => {
    let items = [0, 1, 2, 3];

    return thunk.shouldBeCalledWith(0).andWillReturn(Promise.resolve())
      .then(thunk.shouldBeCalledWith(1).andWillReturn(Promise.resolve()))
      .then(thunk.shouldBeCalledWith(2).andWillReturn(Promise.resolve()))
      .then(thunk.shouldBeCalledWith(3).andWillReturn(Promise.resolve()))
      .when(() => {
        return shouldResolve(forEachLoop(items, thunk));
      }).then(() => {
        expect(items).toEqual([0, 1, 2, 3]);
      });
  }));
});
