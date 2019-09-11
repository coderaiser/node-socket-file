'use strict';

const {run} = require('madrun');

module.exports = {
    'test': () => 'tape test/**/*.js',
    'watch:test': () => 'nodemon -w test -w lib --exec npm test',
    'lint': () => 'putout lib test',
    'fix:lint': () => run('lint', '--fix'),
    'lint:eslint:client': () => 'putout --config .putoutrc-client lib',
    'lint:eslint:server': () => 'putout lib test',
    'coverage': () => 'nyc npm test',
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
};

