var debug = require('debug')('block-sequence:mysql')
var mysql = require('mysql')
var _ = require('lodash').runInContext()
var safeParse = require('safe-json-parse/callback')
var async = require('async')
var fs = require('fs')
var path = require('path')

module.exports = function init(config, cb) {

    if (arguments.length === 1) return init({}, arguments[0])

    var scripts = {}
    var pool = mysql.createPool(_.defaults({ multipleStatements: true }, config));

    function ensure(options, cb) {

        if (options.name === null || options.name === undefined) return cb(new Error('name is required'))

        var name = options.name.toLowerCase()
        var value = options.value || 0
        var metadata = options.metadata || {}

        pool.query(scripts['ensure'], [ name, value, JSON.stringify(metadata), name ], function(err, results) {
            if (err) return cb(err)
            deserialize(results[1][0], cb)
        })
    }

    function allocate(options, cb) {

        var size = options.size || 1

        ensure(options, function(err, sequence) {
            if (err) return cb(err)
            pool.query(scripts['allocate'], [ sequence.name, size ], function(err, results) {
                if (err) return cb(err)
                deserialize(results[0][0], function(err, sequence) {
                    if (err) return cb(err)
                    cb(null, _.chain({ next: sequence.value - size + 1, remaining: size })
                              .defaultsDeep(sequence)
                              .omit(['value'])
                              .value()
                    )
                })
            })
        })
    }

    function remove(options, cb) {
        debug('Removing %s', options.name)
        if (options.name === null || options.name === undefined) return cb(new Error('name is required'))
        pool.query(scripts['remove'], [options.name.toLowerCase()], cb)
    }

    function loadScripts(cb) {
        fs.readdir(path.join(__dirname, 'sql'), function(err, files) {
            if (err) return cb(err)
            async.each(files, function(file, cb) {
                debug('Loading %s', file)
                fs.readFile(path.join(__dirname, 'sql', file), { encoding: 'utf-8' }, function(err, script) {
                    if (err) return cb(err)
                    scripts[path.basename(file, '.sql')] = script
                    cb()
                })
            }, cb)
        }, cb)
    }

    function deserialize(record, cb) {
        safeParse(record.metadata, function(err, metadata) {
            cb(err, { name: record.name, value: record.value, metadata: metadata })
        })
    }

    function close(cb) {
        pool.end(cb)
    }

    function ensureDatabaseObjects(cb) {

        function createBlockSequenceTable(cb) {
            debug('Creating gs_block_sequence table')
            pool.query(scripts['create_gs_block_sequence_table'], [], cb)
        }

        function checkIfBlockSequenceIncExists(meh, meh2, cb) {
            debug('Checking if gs_block_sequence_inc procedure exists')
            pool.query(scripts['gs_block_sequence_inc_procedure_exists'], [], function(err, results) {
                if (err) return cb(err)
                cb(null, results.length === 1)
            })
        }

        function createBlockSequenceInc(exists, cb) {
            if (exists) return cb()
            debug('Creating gs_block_sequence_inc procedure')
            pool.query(scripts['create_gs_block_sequence_inc_procedure'], [], cb)
        }

        async.waterfall([
            createBlockSequenceTable,
            checkIfBlockSequenceIncExists,
            createBlockSequenceInc
        ], cb)
    }

    async.series([
        loadScripts,
        ensureDatabaseObjects
    ], function(err) {
        cb(err, {
            remove: remove,
            allocate: allocate,
            ensure: ensure,
            close: close
        })
    })
}

