'use strict';

describe('doWhile', () => {
  let utility = require('./utility.js');
  let loops = require('../src/loops.js');
  let mach = require('mach.js');

  let asyncTest = utility.asyncTest;
  let shouldResolve = utility.shouldResolve;
  let shouldReject = utility.shouldReject;
  let doWhileLoop = loops.doWhile;

  let condition = mach.mockFunction('condition');
  let thunk = mach.mockFunction('thunk');

  it('should call the loop body once if the condition is false', asyncTest(() => {
    return thunk.shouldBeCalledWith(undefined).andWillReturn(Promise.resolve())
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(doWhileLoop(condition, thunk));
      });
  }));

  it('should reject if thunk rejects', asyncTest(() => {
    return thunk.shouldBeCalledWith(undefined).andWillReturn(Promise.reject('oh noes!'))
      .when(() => {
        return shouldReject(doWhileLoop(condition, thunk), 'oh noes!');
      });
  }));

  it('should resolve with the value thunk resolves with', asyncTest(() => {
    return thunk.shouldBeCalledWith(undefined).andWillReturn(Promise.resolve('oh hai der!'))
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(doWhileLoop(condition, thunk), 'oh hai der!');
      });
  }));

  it('should execute the loop until the condition is false', asyncTest(() => {
    let iteration = () => {
      return thunk.shouldBeCalledWith(undefined).andWillReturn(Promise.resolve())
        .then(condition.shouldBeCalled().andWillReturn(true));
    };

    return iteration()
      .then(iteration())
      .then(iteration())
      .then(iteration())
      .then(thunk.shouldBeCalledWith(undefined).andWillReturn(Promise.resolve()))
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(doWhileLoop(condition, thunk));
      });
  }));

  it('should return previous value when break is called', asyncTest(() => {
    let i = 0;
    return shouldResolve(doWhileLoop(() => i < 10, () => {
      i++;
      if(i === 5) {
        return Promise.reject(loops.break);
      }
      else {
        return Promise.resolve(i);
      }
    }), 4);
  }));

  it('should terminate thunks early if continue is called', asyncTest(() => {
    let i = 0;
    let j = 0;
    return shouldResolve(doWhileLoop(() => i < 10, () => {
      i++;
      if(i % 2 === 0) {
        return Promise.reject(loops.continue);
      }
      else {
        j++;
        return Promise.resolve(j);
      }
    }), 5);
  }));
});
