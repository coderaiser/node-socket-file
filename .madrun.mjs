import {run} from 'madrun';

export default {
    'test': () => 'tape test/**/*.js',
    'watch:test': () => 'nodemon -w test -w lib --exec npm test',
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'lint:eslint:client': () => 'putout --config .putoutrc-client lib',
    'lint:eslint:server': () => 'putout lib test',
    'coverage': () => 'nyc npm test',
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
};

