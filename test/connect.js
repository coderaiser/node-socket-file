'use strict';

const {promisify} = require('node:util');
const http = require('node:http');
const express = require('express');
const freeport = require('freeport');
const io = require('socket.io');
const ioClient = require('socket.io-client');

module.exports = (prefix, middle) => promisify((path, options, fn) => {
    connect(prefix, middle, path, options, fn);
});

function connect(defaultPrefix, middle, path, options, fn) {
    if (!path) {
        throw Error('path could not be empty!');
    } else if (!fn && !options) {
        fn = path;
        path = '';
    } else if (!fn) {
        fn = options;
        options = null;
    }
    
    path = path.replace(/^\/|\/$/g, '');
    
    if (!options || !options.prefix) {
        path = defaultPrefix;
    } else {
        const {
            prefix = defaultPrefix,
        } = options;
        
        path = `${prefix}${!path ? '' : '/' + path}`;
    }
    
    const app = express();
    const server = http.createServer(app);
    
    middle(io(server), options);
    
    freeport((error, port) => {
        const ip = '127.0.0.1';
        
        if (options && !Object.keys(options).length)
            options = undefined;
        
        server.listen(port, ip, () => {
            const url = `http://127.0.0.1:${port}/${path}`;
            const socket = ioClient(url);
            
            fn(null, socket, () => {
                socket.destroy();
                server.close();
            });
        });
    });
}
