'use strict';

describe('for', () => {
  const utility = require('jasmine-async-utilities');
  const loops = require('../src/loops.js');
  const mach = require('mach.js');

  const asyncTest = utility.asyncTest;
  const shouldResolve = utility.shouldResolve;
  const shouldReject = utility.shouldReject;
  const forLoop = loops.for;

  const initial = mach.mockFunction('initial');
  const condition = mach.mockFunction('condition');
  const update = mach.mockFunction('update');
  const thunk = mach.mockFunction('thunk');

  it('should not call the loop body if the condition is false', asyncTest(() => {
    return initial.shouldBeCalled()
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(() => forLoop(initial, condition, update, thunk));
      });
  }));

  it('should reject if thunk rejects', asyncTest(() => {
    return initial.shouldBeCalled()
      .then(condition.shouldBeCalled().andWillReturn(true))
      .then(thunk.shouldBeCalledWith().andWillReturn(Promise.reject('oh noes!')))
      .when(() => {
        return shouldReject(() => forLoop(initial, condition, update, thunk), 'oh noes!');
      });
  }));

  it('should execute the loop until the condition is false', asyncTest(() => {
    const iteration = () => {
      return condition.shouldBeCalled().andWillReturn(true)
        .then(thunk.shouldBeCalledWith().andWillReturn(Promise.resolve()))
        .then(update.shouldBeCalled());
    };

    return initial.shouldBeCalled()
      .then(iteration())
      .then(iteration())
      .then(iteration())
      .then(iteration())
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(() => forLoop(initial, condition, update, thunk));
      });
  }));

  it('should abort iterating when break is thrown', asyncTest(() => {
    let i;
    return shouldResolve(() => forLoop(() => i = 0, () => i < 10, () => i++, () => {
        if(i === 5) {
          return Promise.reject(loops.break);
        }
        else {
          return Promise.resolve(i);
        }
      }))
      .then(() => expect(i).toEqual(5));
  }));

  it('should terminate thunks early if continue is called', asyncTest(() => {
    let i;
    let j = 0;
    return shouldResolve(() => forLoop(() => i = 0, () => i < 10, () => i++, () => {
        if(i % 2 === 0) {
          return Promise.reject(loops.continue);
        }
        else {
          j++;
          return Promise.resolve(j);
        }
      }))
      .then(() => {
        expect(i).toEqual(10);
        expect(j).toEqual(5);
      });
  }));
});
