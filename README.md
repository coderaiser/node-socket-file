# Socket-file [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

File processing with help of [socket.io](http://socket.io "Socket.io").

## Install

```
npm i socket-file --save
```

## How to use?

```js
const socketFile = require('socket-file');

const http = require('http');
const express = require('express');
const io = require('socket.io');

const app = express();
const server = http.createServer(app);
const socket = io.listen(server);

server.listen(port, ip);

socketFile(socket, {
    prefix: 'edward',
    root: '/',      /* string or function       */
    size: '512000', /* max file size for patch  */
    auth: (accept, reject) => (username, password) {
        accept();
    }
});
```

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/socket-file.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/david/coderaiser/node-socket-file.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/node-socket-file/master.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/socket-file "npm"
[DependencyStatusURL]:      https://david-dm.org/coderaiser/node-socket-file "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/node-socket-file  "Build Status"

