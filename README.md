# [async-loops](https://github.com/h2oboi89/async-loops)

Asynchronous for, while, do-while, and for-each loops using Promises.

## Setup
- Run `npm install` to install all dependencies

## Scripts
Following are called via `npm run`:
- `test` to run all tests and generate coverage report
- `test -- -i` same as `test` but ignores linter warnings
- `docClone` to clone your documentation repository
- `docGenerate` to generate documentation locally
- `docPublish` to generate and publish documentation on GitHub Pages

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
