var complianceTests = require('block-sequence-compliance-tests')
var BlockSequence = require('../index')

BlockSequence({ host: '127.0.0.1', database: 'bs_test', user: 'root' }, function(err, blockSequence) {
    if (err) throw err
    complianceTests(blockSequence).onFinish(blockSequence.close)
})
