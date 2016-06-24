'use strict';

describe('loops', () => {
  let utility = require('./utility.js');
  let loops = require('../src/loops.js');

  let asyncTest = utility.asyncTest;
  let shouldResolve = utility.shouldResolve;

  describe('for', () => {
    it('should be able to sum up a list of numbers', asyncTest(() => {
      let items = [0, 1, 2, 3, 4, 5];
      let i;

      return shouldResolve(loops.for(
        () => i = 0,
        () => i < items.length,
        () => i++,
        (value) => {
          return Promise.resolve(value + items[i]);
        },
        0), 15);
    }));
  });

  describe('while', () => {
    it('should be able to sum up a list of numbers', asyncTest(() => {
      let items = [0, 1, 2, 3, 4, 5];
      let i = 0;

      return shouldResolve(loops.while(
        () => i < items.length,
        (value) => {
          return Promise.resolve(value + items[i++]);
        },
        0), 15);
    }));
  });

  describe('doWhile', () => {
    it('should be able to sum up a list of numbers', asyncTest(() => {
      let items = [0, 1, 2, 3, 4, 5];
      let i = 0;

      return shouldResolve(loops.doWhile(
        () => i < items.length,
        (value) => {
          return Promise.resolve(value + items[i++]);
        },
        0), 15);
    }));
  });

  describe('forEach', () => {
    it('should be able to sum up a list of numbers', asyncTest(() => {
      return shouldResolve(loops.forEach([0, 1, 2, 3, 4, 5], (value, item) => {
          return Promise.resolve(value + item);
        },
        0), 15);
    }));
  });
});
