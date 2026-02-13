# Socket-file [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

[NPMIMGURL]: https://img.shields.io/npm/v/socket-file.svg?style=flat
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[BuildStatusIMGURL]: https://img.shields.io/travis/coderaiser/node-socket-file/master.svg?style=flat
[NPMURL]: https://npmjs.org/package/socket-file "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[BuildStatusURL]: https://travis-ci.org/coderaiser/node-socket-file "Build Status"

File processing with help of [socket.io](http://socket.io "Socket.io").

## Install

```
npm i socket-file --save
```

## How to use?

```js
import http from 'node:http';
import {socketFile} from 'socket-file';

import express from 'express';
import {Server} from 'socket.io';

const app = express();
const server = http.createServer(app);
const socket = new Server(server);

server.listen(port, ip);

socketFile(socket, {
    prefix: 'edward',
    // string or function
    root: '/',
    // max file size for patch
    size: '512000',
    auth: (accept, reject) => (username, password) => {
        accept();
    },
});
```

## License

MIT
