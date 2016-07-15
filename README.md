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

## Usage

### for

```js
let loops = require('async-loops');

let i;
loops.for(
    // initialize
    () => i = 0,
    // condition
    () => i < 10,
    // update
    () => i++,
    // body
    (value) => Promise.resolve(value + i),
    // seed (value for first iteration)
    0)
  .then((result) => {
    // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 => 45
    console.log(result);
  });
```

### while

```js
let loops = require('async-loops');

let i = 0;

loops.while(
    // condition
    () => i < 10,
    // body
    (value) => Promise.resolve(value + i++),
    // seed (value for first iteration)
    0)
  .then((sum) => {
    // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 => 45
    console.log(sum);
  });
```

### doWhile
Only difference between `while` and `doWhile` is that a whiles condition is
checked *BEFORE* running body while a doWhiles is checked *AFTER*.


```js
let loops = require('async-loops');

let i = 0;

loops.doWhile(
    // condition
    () => i < 10,
    // body
    (value) => Promise.resolve(value + i++),
    // seed (value for first iteration)
    0)
  .then((sum) => {
    // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 => 45
    console.log(sum);
  });
```

### forEach

```js
let loops = require('async-loops');

loops.forEach(
    // items
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    // body
    (value, item, index, items) => Promise.resolve(value + item),
    // seed
    0
  )
  .then((result) => {
    // [0, 1, 3, 6, 10, 15, 21, 28, 36, 45]
    console.log(result);
  });
```

### break

```js
let loops = require('async-loops');

let i = 0;

loops.while(
    // condition
    () => true,
    // body
    (value) => {
      if(i < 10) {
        return Promise.resolve(value + i++);
      }
      else {
        // breaks out of while loop.
        // body resolves with value from last iteration
        return Promise.reject(loops.break);
      }
    },
    // seed (value for first iteration)
    0)
  .then((sum) => {
    // 0 + 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 => 45
    console.log(sum);
  });
```

### continue

```js
let loops = require('async-loops');

let i = 0;

loops.while(
    // condition
    () => i < 10,
    // body
    (value) => Promise.resolve(value + i)
    .then((value) => {
      if(i++ % 2 === 0) {
        // `skips` this iteration of while loop.
        // body resolves with value from last iteration
        throw loops.continue;
      }
      else {
        return value
      };
    }),
    // seed (value for first iteration)
    0)
  .then((sum) => {
    // 1 + 3 + 5 + 7 + 9 => 25
    console.log(sum);
  });
```

## Documentation
[JSDoc documentation](https://h2oboi89.github.io/async-loops/)

## Usage
[Samples](https://github.com/h2oboi89/async-loops/tree/master/sample)
