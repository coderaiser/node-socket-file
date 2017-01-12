'use strict';

var fs          = require('fs'),
    path        = require('path'),
    
    Emitter     = require('events').EventEmitter,
    patch       = require('patchfile'),
    ashify      = require('ashify'),
    
    mellow      = require('mellow');

module.exports          = function(sock, options) {
    var emitter = new Emitter();
    
    if (!options)
        options = {
            size    : 512000,
            root    : '/'
        };
    
    check(options.authCheck);
    
    process.nextTick(function() {
        listen(sock, options, emitter);
    });
    
    return emitter;
};

function getRoot(root) {
    var value;
    
    if (typeof root === 'function')
        value = root();
    else
        value = root;
    
    return value;
}

function check(authCheck) {
    if (authCheck && typeof authCheck !== 'function')
        throw Error('authCheck should be function!');
}

function listen(socket, options, emitter) {
    var authCheck   = options.authCheck,
        prefix      = options.prefix || 'socket-file',
        root        = options.root   || '/';
    
    socket.of(prefix)
        .on('connection', function(socket) {
            if (!authCheck)
                connection(root, socket, options, emitter);
            else
                authCheck(socket, function() {
                    connection(root, socket, options, emitter);
                });
        });
}

function connection(root, socket, options, emitter) {
    var onError = function(error) {
            socket.emit('err', error);
        },
        onFile  = function(name, data) {
            var filename,
                value = getRoot(root);
            
            filename = mellow.pathFromWin(name, value);
            socket.emit('file', filename, data);
        };
    
    emitter.on('error', onError);
    
    emitter.on('file', onFile);
    
    socket.on('patch', function(name, data) {
        var value = getRoot(root);
        var fullName = mellow.pathToWin(name, value);
        
        getHash(fullName, function(error, hash) {
            if (error)
                return socket.emit('err', error.message);
            
            patch(fullName, data, options, function(error) {
                if (error)
                    return socket.emit('err', error.message);
                    
                var baseName = path.basename(fullName);
                var msg = 'patch: ok("' + baseName + '")';
                
                socket.emit('message', msg);
                socket.broadcast.emit('patch', fullName, data, hash);
            });
        });
    });
    
    emitter.emit('connection');
    
    socket.on('disconnect', function() {
        emitter.removeListener('error', onError);
        emitter.removeListener('file', onFile);
    });
}

function getHash(name, callback) {
    var stream  = fs.createReadStream(name),
        options = {
            algorithm: 'sha1',
            encoding: 'hex'
        };
    
    ashify(stream, options, callback);
}

