'use strict';

const test = require('supertape');
const socketFile = require('..');
const connect = require('./connect')('socket-file', socketFile);

test('socket-file: options: prefix', (t) => {
    connect('/', {prefix: 'hello'}, (socket, callback) => {
        socket.on('connect', () => {
            t.pass('connected with prefix');
            t.end();
            callback();
        });
    });
});

test('socket-file: options: root', (t) => {
    connect('/', {root: __dirname}, (socket, callback) => {
        socket.on('connect', () => {
            const name = String(Math.random());
            
            socket.emit('patch', name, 'hello world');
            
            socket.on('err', (error) => {
                t.ok(error, error);
                t.end();
                callback();
            });
        });
    });
});

test('socket-file: options: empty object', (t) => {
    connect('/', {}, (socket, callback) => {
        socket.on('connect', () => {
            t.end();
            callback();
        });
    });
});

test('socket-file: options: auth not function', (t) => {
    const auth = {};
    const fn = () => {
        connect('/', {auth}, () => {
        });
    };
    
    t.throws(fn, /auth should be function!/, 'should throw when auth not function');
    t.end();
});

test('socket-file: options: auth: wrong credentials', (t) => {
    const auth = (accept, reject) => () => {
        reject();
    };
    
    connect('/', {auth}, (socket, done) => {
        socket.emit('auth', 'jhon', 'lajoie');
        
        socket.on('reject', () => {
            t.pass('should reject');
            done();
            t.end();
        });
    });
});

test('socket-file: options: auth: correct credentials', (t) => {
    const auth = (accept) => () => {
        accept();
    };
    
    connect('/', {auth}, (socket, fn) => {
        socket.emit('auth', 'hello', 'world');
        
        socket.on('connect', () => {
            t.pass('should grant access');
            t.end();
            fn();
        });
        
        socket.on('err', (error) => {
            t.notOk(error, 'should not be error');
        });
    });
});

