'use strict';

const process = require('node:process');
const path = require('node:path');

const {EventEmitter} = require('node:events');
const patch = require('patchfile');
const ashify = require('ashify');
const wraptile = require('wraptile');
const mellow = require('mellow');
const {tryToCatch} = require('try-to-catch');
const {read} = require('win32');

const connectionWraped = wraptile(connection);

const isFn = (a) => typeof a === 'function';

module.exports = (sock, options) => {
    const emitter = new EventEmitter();
    
    if (!options)
        options = {
            size: 512_000,
            root: '/',
        };
    
    check(options.auth);
    
    process.nextTick(() => {
        listen(sock, options, emitter);
    });
    
    return emitter;
};

function getRoot(root) {
    if (isFn(root))
        return root();
    
    return root;
}

function check(auth) {
    if (auth && !isFn(auth))
        throw Error('auth should be function!');
}

function listen(socket, options, emitter) {
    const {
        auth,
        prefix = 'socket-file',
        root = '/',
    } = options;
    
    socket
        .of(prefix)
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
    
    const onFile = (name, data) => {
        const value = getRoot(root);
        const filename = mellow.winToWeb(name, value);
        
        socket.emit('file', filename, data);
    };
    
    emitter.on('error', onError);
    emitter.on('file', onFile);
    
    socket.on('patch', async (name, data) => {
        const value = getRoot(root);
        const fullName = mellow.webToWin(name, value);
        
        const [hashError, hash] = await tryToCatch(getHash, fullName);
        
        if (hashError)
            return socket.emit('err', hashError.message);
        
        const [patchError] = await tryToCatch(patch, fullName, data, options);
        
        if (patchError)
            return socket.emit('err', patchError.message);
        
        const baseName = path.basename(fullName);
        const msg = `patch: ok("${baseName}")`;
        
        socket.emit('message', msg);
        socket.broadcast.emit('patch', fullName, data, hash);
    });
    
    emitter.emit('connection');
    
    socket.on('disconnect', () => {
        emitter.removeListener('error', onError);
        emitter.removeListener('file', onFile);
    });
}

module.exports.getHash = getHash;
async function getHash(name) {
    const options = {
        algorithm: 'sha1',
        encoding: 'hex',
    };
    
    return await ashify(await read(name), options);
}
