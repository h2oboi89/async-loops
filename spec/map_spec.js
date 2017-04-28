'use strict';

describe('map', () => {
  const utility = require('jasmine-async-utilities');
  const mach = require('mach.js');
  const loops = require('../src/loops.js');

  const asyncTest = utility.asyncTest;
  const shouldResolve = utility.shouldResolve;
  const shouldReject = utility.shouldReject;
  const mapLoop = loops.map;

  const thunk = mach.mockFunction('thunk');

  it('should not call the loop body if items is empty', asyncTest(() => {
    return shouldResolve(mapLoop([], thunk), []);
  }));

  it('should reject if thunk rejects', asyncTest(() => {
    const items = [0, 1, 2, 3];

    return thunk.shouldBeCalledWith(0, 0, mach.same(items))
      .andWillReturn(Promise.reject('oh noes!'))
      .when(() => {
        return shouldReject(mapLoop(items, thunk), 'oh noes!');
      });
  }));

  it('should execute once for each item in the array', asyncTest(() => {
    const items = [0, 1, 2, 3];

    const iteration = (item, index) => {
      return thunk.shouldBeCalledWith(item, index, mach.same(items));
    };

    return iteration(0, 0).andWillReturn(Promise.resolve(0))
      .then(iteration(1, 1).andWillReturn(Promise.resolve(1)))
      .then(iteration(2, 2).andWillReturn(Promise.resolve(3)))
      .then(iteration(3, 3).andWillReturn(Promise.resolve(6)))
      .when(() => {
        return shouldResolve(mapLoop(items, thunk, 0), [0, 1, 3, 6]);
      }).then(() => {
        expect(items).toEqual([0, 1, 2, 3]);
      });
  }));

  it('should abort iterating when break is thrown', asyncTest(() => {
    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return shouldResolve(mapLoop(items, (item, index) => {
      if(index === 5) {
        return Promise.reject(loops.break);
      }
      else {
        return Promise.resolve(item + 1);
      }
    }), [1, 2, 3, 4, 5, 5, 6, 7, 8, 9]);
  }));

  it('should terminate thunks early if continue is called', asyncTest(() => {
    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return shouldResolve(mapLoop(items, (item, index) => {
      if(index % 2 === 0) {
        return Promise.reject(loops.continue);
      }
      else {
        return Promise.resolve(item * 2);
      }
    }), [0, 2, 2, 6, 4, 10, 6, 14, 8, 18]);
  }));

  it('should terminate if items is shortened', asyncTest(() => {
    const items = [0, 1, 2, 3, 4, 5];

    return shouldResolve(mapLoop(items, (item, index, items) => {
      items.length = 0;

      return Promise.resolve();
    }), [undefined, 1, 2, 3, 4, 5]);
  }));
});
