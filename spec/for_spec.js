'use strict';

describe('for', () => {
  let utility = require('./utility.js');
  let loops = require('../src/loops.js');
  let mach = require('mach.js');

  let asyncTest = utility.asyncTest;
  let shouldResolve = utility.shouldResolve;
  let shouldReject = utility.shouldReject;
  let forLoop = loops.for;

  let initial = mach.mockFunction('initial');
  let condition = mach.mockFunction('condition');
  let update = mach.mockFunction('update');
  let thunk = mach.mockFunction('thunk');

  it('should not call the loop body if the condition is false', asyncTest(() => {
    return initial.shouldBeCalled()
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(forLoop(initial, condition, update, thunk));
      });
  }));

  it('should reject if thunk rejects', asyncTest(() => {
    return initial.shouldBeCalled()
      .then(condition.shouldBeCalled().andWillReturn(true))
      .then(thunk.shouldBeCalled().andWillReturn(Promise.reject('oh noes!')))
      .when(() => {
        return shouldReject(forLoop(initial, condition, update, thunk), 'oh noes!');
      });
  }));

  it('should resolve with the value thunk resolves with', asyncTest(() => {
    return initial.shouldBeCalled()
      .then(condition.shouldBeCalled().andWillReturn(true))
      .then(thunk.shouldBeCalled().andWillReturn(Promise.resolve('oh hai der!')))
      .then(update.shouldBeCalled())
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(forLoop(initial, condition, update, thunk), 'oh hai der!');
      });
  }));

  it('should execute the loop until the condition is false', asyncTest(() => {
    let iteration = () => {
      return condition.shouldBeCalled().andWillReturn(true)
        .then(thunk.shouldBeCalled().andWillReturn(Promise.resolve()))
        .then(update.shouldBeCalled());
    };

    return initial.shouldBeCalled()
      .then(iteration())
      .then(iteration())
      .then(iteration())
      .then(iteration())
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(forLoop(initial, condition, update, thunk));
      });
  }));
});
