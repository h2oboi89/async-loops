'use strict';

describe('for', () => {
  let utility = require('jasmine-async-utilities');
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
      .then(thunk.shouldBeCalledWith(undefined).andWillReturn(Promise.reject('oh noes!')))
      .when(() => {
        return shouldReject(forLoop(initial, condition, update, thunk), 'oh noes!');
      });
  }));

  it('should resolve with the value thunk resolves with', asyncTest(() => {
    return initial.shouldBeCalled()
      .then(condition.shouldBeCalled().andWillReturn(true))
      .then(thunk.shouldBeCalledWith(undefined).andWillReturn(Promise.resolve('oh hai der!')))
      .then(update.shouldBeCalled())
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(forLoop(initial, condition, update, thunk), 'oh hai der!');
      });
  }));

  it('should execute the loop until the condition is false', asyncTest(() => {
    let iteration = () => {
      return condition.shouldBeCalled().andWillReturn(true)
        .then(thunk.shouldBeCalledWith(undefined).andWillReturn(Promise.resolve()))
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

  it('should return previous value when break is called', asyncTest(() => {
    let i;
    return shouldResolve(forLoop(() => i = 0, () => i < 10, () => i++, () => {
      if(i === 5) {
        return Promise.reject(loops.break);
      }
      else {
        return Promise.resolve(i);
      }
    }), 4);
  }));

  it('should terminate thunks early if continue is called', asyncTest(() => {
    let i;
    let j = 0;
    return shouldResolve(forLoop(() => i = 0, () => i < 10, () => i++, () => {
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
