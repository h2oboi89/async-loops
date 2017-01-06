# [async-loops](https://github.com/h2oboi89/async-loops)

Asynchronous for, while, do-while, and for-each loops using Promises.

## Setup
- Run `npm install` to install all dependencies
- Run `npm update` to update dependencies

## Scripts
- Run `npm test` to run all tests
- Run `npm run lint` to perform a lint check
- Run `npm run coverage` to calculate unit test code coverage
   - see coverage/lcov-report/index.html for detailed report
- Run `npm run watch` to automatically run tests and lint check when files change
- Run `npm run docClone` to clone your documentation repository
- Run `npm run docGenerate` to generate documentation locally
- Run `npm run docPublish` to generate and publish documentation on GitHub Pages

## Documentation
[JSDoc documentation](https://h2oboi89.github.io/async-loops/)

## Usage

### Resolve
Body of each loop should resolve.
For `map` and `reduce` they should do so with a value.

### Reject
Rejections are seen as errors and will be used to abort the loop.
`loops.break` and `loops.continue` are special cases that are used as flow control.

[Samples](https://github.com/h2oboi89/async-loops/tree/master/sample)
