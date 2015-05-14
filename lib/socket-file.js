(function() {
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
    
    function listen(sock, options, emitter) {
        var prefix  = options.prefix    || 'socket-file',
            root    = options.root      || '/';
        
        sock.of(prefix)
            .on('connection', function(socket) {
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
                    
                    name = mellow.pathToWin(name, value);
                    
                    getHash(name, function(error, hash) {
                        if (error)
                            socket.emit('err', error.message);
                        else
                            patch(name, data, options, function(error) {
                                var msg, baseName;
                                
                                if (error) {
                                    socket.emit('err', error.message);
                                } else {
                                    baseName    = path.basename(name),
                                    msg         = 'patch: ok("' + baseName + '")';
                                    
                                    socket.emit('message', msg);
                                    socket.broadcast.emit('patch', name, data, hash);
                                }
                            });
                    });
                });
                
                emitter.emit('connection');
                
                socket.on('disconnect', function() {
                    emitter.removeListener('error', onError);
                    emitter.removeListener('file', onFile);
                });
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
})();
