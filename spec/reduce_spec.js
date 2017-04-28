'use strict';

describe('reduce', () => {
  const utility = require('jasmine-async-utilities');
  const mach = require('mach.js');
  const loops = require('../src/loops.js');

  const asyncTest = utility.asyncTest;
  const shouldResolve = utility.shouldResolve;
  const shouldReject = utility.shouldReject;
  const reduceLoop = loops.reduce;

  const thunk = mach.mockFunction('thunk');

  it('should not call the loop body if items is empty', asyncTest(() => {
    return shouldResolve(reduceLoop([], thunk), 0);
  }));

  it('should reject if thunk rejects', asyncTest(() => {
    const items = [0, 1, 2, 3];

    return thunk.shouldBeCalledWith(0, 0, 0, mach.same(items))
      .andWillReturn(Promise.reject('oh noes!'))
      .when(() => {
        return shouldReject(reduceLoop(items, thunk), 'oh noes!');
      });
  }));


  it('should execute once for each item in the array', asyncTest(() => {
    const items = [0, 1, 2, 3];

    const iteration = (accumulator, item, index) => {
      return thunk.shouldBeCalledWith(accumulator, item, index, mach.same(items));
    };

    return iteration(0, 0, 0).andWillReturn(Promise.resolve(0))
      .then(iteration(0, 1, 1).andWillReturn(Promise.resolve(1)))
      .then(iteration(1, 2, 2).andWillReturn(Promise.resolve(3)))
      .then(iteration(3, 3, 3).andWillReturn(Promise.resolve(6)))
      .when(() => {
        return shouldResolve(reduceLoop(items, thunk, 0), 6);
      }).then(() => {
        expect(items).toEqual([0, 1, 2, 3]);
      });
  }));

  it('should abort iterating when break is thrown', asyncTest(() => {
    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return shouldResolve(reduceLoop(items, (accumulator, item, index) => {
      if(index === 5) {
        return Promise.reject(loops.break);
      }
      else {
        return Promise.resolve(accumulator + index);
      }
    }), 10);
  }));

  it('should terminate thunks early if continue is called', asyncTest(() => {
    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return shouldResolve(reduceLoop(items, (accumulator, item, index) => {
      if(index % 2 === 0) {
        return Promise.reject(loops.continue);
      }
      else {
        return Promise.resolve(accumulator + item);
      }
    }), 25);
  }));

  it('should terminate if items is shortened', asyncTest(() => {
    const items = [0, 1, 2, 3, 4, 5];

    return shouldResolve(reduceLoop(items, (accumulator, item, index, items) => {
      items.length = 0;

      return Promise.resolve(10);
    }), 10);
  }));
});
