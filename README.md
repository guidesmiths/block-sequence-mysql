# block-sequence-mysql
A MySQL implementation of [block-sequence](https://www.npmjs.com/package/block-sequence).

## Usage
```js
var BlockArray = require('block-sequence').BlockArray
var init = require('block-sequence-mysql')

// Initialise the MySql Block Sequence Driver
init({ host: '127.0.0.1', database: 'bs_test', user: 'root' }, function(err, driver) {
    if (err) throw err

    // Ensure the sequence exists
    driver.ensure({ name: 'my-sequence' }, function(err, sequence) {
        if (err) throw err

        // Create a block array containing 1000 ids per block (defaults to 2 blocks)
        var idGenerator = new BlockArray({ block: { driver: driver, size: 1000 } })

        // Grab the next id
        idGenerator.next(function(err, id) {
            if (err) throw err
            console.log(id)
        })
    })
})
```
See https://www.npmjs.com/package/mysql for all connection parameters



