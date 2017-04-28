'use strict';

describe('while', () => {
  const utility = require('jasmine-async-utilities');
  const mach = require('mach.js');
  const loops = require('../src/loops.js');

  const asyncTest = utility.asyncTest;
  const shouldResolve = utility.shouldResolve;
  const shouldReject = utility.shouldReject;
  const whileLoop = loops.while;

  const condition = mach.mockFunction('condition');
  const thunk = mach.mockFunction('thunk');

  it('should not call the loop body if the condition is false', asyncTest(() => {
    return condition.shouldBeCalled().andWillReturn(false)
      .when(() => {
        return shouldResolve(() => whileLoop(condition, thunk));
      });
  }));

  it('should reject if thunk rejects', asyncTest(() => {
    return condition.shouldBeCalled().andWillReturn(true)
      .then(thunk.shouldBeCalledWith().andWillReturn(Promise.reject('oh noes!')))
      .when(() => {
        return shouldReject(() => whileLoop(condition, thunk), 'oh noes!');
      });
  }));

  it('should execute the loop until the condition is false', asyncTest(() => {
    const iteration = () => {
      return condition.shouldBeCalled().andWillReturn(true)
        .then(thunk.shouldBeCalledWith().andWillReturn(Promise.resolve()));
    };

    return iteration()
      .then(iteration())
      .then(iteration())
      .then(iteration())
      .then(condition.shouldBeCalled().andWillReturn(false))
      .when(() => {
        return shouldResolve(() => whileLoop(condition, thunk));
      });
  }));

  it('should abort iterating when break is thrown', asyncTest(() => {
    let i = 0;
    return shouldResolve(() => whileLoop(() => i < 10, () => {
        i++;
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
    let i = 0;
    let j = 0;
    return shouldResolve(() => whileLoop(() => i < 10, () => {
        i++;
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
