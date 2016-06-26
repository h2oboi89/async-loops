'use strict';

let shouldReject = (thunk, reason) => {
  return thunk
    .then(() => fail('should have rejected'))
    .catch((error) => expect(error).toEqual(reason));
};

let shouldResolve = (thunk, expectedValue) => {
  return thunk
    .then((value) => {
      expect(value).toEqual(expectedValue);
    });
};

let asyncTest = (thunk) => (done) => {
  return thunk()
    .catch(fail)
    .then(done);
};

module.exports = {
  asyncTest: asyncTest,
  shouldReject: shouldReject,
  shouldResolve: shouldResolve
};
