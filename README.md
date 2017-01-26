# block-sequence-mysql
A MySQL implementation of [block-sequence](https://www.npmjs.com/package/block-sequence).

[![NPM version](https://img.shields.io/npm/v/block-sequence-mysql.svg?style=flat-square)](https://www.npmjs.com/package/block-sequence-mysql)
[![NPM downloads](https://img.shields.io/npm/dm/block-sequence-mysql.svg?style=flat-square)](https://www.npmjs.com/package/block-sequence-mysql)
[![Build Status](https://img.shields.io/travis/guidesmiths/block-sequence-mysql/master.svg)](https://travis-ci.org/guidesmiths/block-sequence-mysql)
[![Code Climate](https://codeclimate.com/github/guidesmiths/block-sequence-mysql/badges/gpa.svg)](https://codeclimate.com/github/guidesmiths/block-sequence-mysql)
[![Test Coverage](https://codeclimate.com/github/guidesmiths/block-sequence-mysql/badges/coverage.svg)](https://codeclimate.com/github/guidesmiths/block-sequence-mysql/coverage)
[![Code Style](https://img.shields.io/badge/code%20style-imperative-brightgreen.svg)](https://github.com/guidesmiths/eslint-config-imperative)
[![Dependency Status](https://david-dm.org/guidesmiths/block-sequence-mysql.svg)](https://david-dm.org/guidesmiths/block-sequence-mysql)
[![devDependencies Status](https://david-dm.org/guidesmiths/block-sequence-mysql/dev-status.svg)](https://david-dm.org/guidesmiths/block-sequence-mysql?type=dev)

## Usage
```js
const BlockArray = require('block-sequence').BlockArray
const init = require('block-sequence-mysql')

// Initialise the MySql Block Sequence Driver
init({ host: '127.0.0.1', database: 'bs_test', user: 'root' }, (err, driver) => {
    if (err) throw err

    // Ensure the sequence exists
    driver.ensure({ name: 'my-sequence' }, (err, sequence) => {
        if (err) throw err

        // Create a block array containing 1000 ids per block (defaults to 2 blocks)
        const idGenerator = new BlockArray({ block: { sequence: sequence, driver: driver, size: 1000 } })

        // Grab the next id
        idGenerator.next((err, id) => {
            if (err) throw err
            console.log(id)
        })
    })
})
```
See https://www.npmjs.com/package/mysql for all connection parameters



