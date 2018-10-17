'use strict';

const fs = require('fs');
const path = require('path');

const Emitter = require('events').EventEmitter;
const patch = require('patchfile');
const ashify = require('ashify');
const wraptile = require('wraptile/legacy');
const mellow = require('mellow');

const connectionWraped = wraptile(connection);

module.exports = (sock, options) => {
    const emitter = new Emitter();
    
    if (!options)
        options = {
            size    : 512000,
            root    : '/'
        };
    
    check(options.auth);
    
    process.nextTick(() => {
        listen(sock, options, emitter);
    });
    
    return emitter;
};

function getRoot(root) {
    if (typeof root === 'function')
        return root();
    
    return root;
}

function check(auth) {
    if (auth && typeof auth !== 'function')
        throw Error('auth should be function!');
}

function listen(socket, options, emitter) {
    const auth = options.auth;
    const prefix = options.prefix || 'socket-file';
    const root = options.root || '/';
    
    socket.of(prefix)
        .on('connection', (socket) => {
            const connect = connectionWraped(root, socket, options, emitter);
            
            if (!auth)
                return connect();
            
            const reject = () => socket.emit('reject');
            socket.on('auth', auth(connect, reject));
        });
}

function connection(root, socket, options, emitter) {
    const onError = (error) => {
        socket.emit('err', error);
    };
    const onFile  = (name, data) => {
        const value = getRoot(root);
        const filename = mellow.pathFromWin(name, value);
        
        socket.emit('file', filename, data);
    };
    
    emitter.on('error', onError);
    emitter.on('file', onFile);
    
    socket.on('patch', (name, data) => {
        const value = getRoot(root);
        const fullName = mellow.pathToWin(name, value);
        
        getHash(fullName, (error, hash) => {
            if (error)
                return socket.emit('err', error.message);
            
            patch(fullName, data, options)
                .then(() => {
                    const baseName = path.basename(fullName);
                    const msg = 'patch: ok("' + baseName + '")';
                    
                    socket.emit('message', msg);
                    socket.broadcast.emit('patch', fullName, data, hash);
                })
                .catch((error) => {
                    return socket.emit('err', error.message);
                });
        });
    });
    
    emitter.emit('connection');
    
    socket.on('disconnect', () => {
        emitter.removeListener('error', onError);
        emitter.removeListener('file', onFile);
    });
}

function getHash(name, callback) {
    const stream  = fs.createReadStream(name),
        options = {
            algorithm: 'sha1',
            encoding: 'hex'
        };
    
    ashify(stream, options, callback);
}

