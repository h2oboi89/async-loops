'use strict';

describe('while', () => {
  let utility = require('./utility.js');
  let loops = require('../src/loops.js');
  let mach = require('mach.js');

  let asyncTest = utility.asyncTest;
  let shouldResolve = utility.shouldResolve;
  let shouldReject = utility.shouldReject;
  let whileLoop = loops.while;

  let condition = mach.mockFunction('condition');
  let thunk = mach.mockFunction('thunk');

  it('should not call the loop body if the condition is false', asyncTest(() => {
    return condition.shouldBeCalled().andWillReturn(false)
      .when(() => {
        return shouldResolve(whileLoop(condition, thunk));
      });
  }));

  it('should reject if thunk rejects', asyncTest(() => {
    return condition.shouldBeCalled().andWillReturn(true)
      .then(thunk.shouldBeCalledWith(undefined).andWillReturn(Promise.reject('oh noes!')))
      .when(() => {
        return shouldReject(whileLoop(condition, thunk), 'oh noes!');
      });
  }));

  it('should resolve with the value thunk resolves with', asyncTest(() => {
    return condition.shouldBeCalled().andWillReturn(true)
      .then(thunk.shouldBeCalledWith(undefined).andWillReturn(Promise.resolve('oh hai der!')))
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(whileLoop(condition, thunk), 'oh hai der!');
      });
  }));

  it('should execute the loop until the condition is false', asyncTest(() => {
    let iteration = () => {
      return condition.shouldBeCalled().andWillReturn(true)
        .then(thunk.shouldBeCalledWith(undefined).andWillReturn(Promise.resolve()));
    };

    return iteration()
      .then(iteration())
      .then(iteration())
      .then(iteration())
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(whileLoop(condition, thunk));
      });
  }));
});
