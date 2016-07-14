# Socket-file [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

File processing with help of [socket.io](http://socket.io "Socket.io").

## Install

```
npm i socket-file --save
```

## How to use?

```js
var socketFile  = require('socket-file'),
    
    http        = require('http'),
    express     = require('express'),
    io          = require('socket.io'),
    app         = express(),
    server      = http.createServer(app);

socket          = io.listen(server),
server.listen(port, ip);

socketFile(socket, {
    prefix: 'edward',
    root: '/',      /* string or function       */
    size: '512000', /* max file size for patch  */
    authCheck: function(socket, success) {
    }
});
```

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/socket-file.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/gemnasium/coderaiser/node-socket-file.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/node-socket-file/master.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/socket-file "npm"
[DependencyStatusURL]:      https://gemnasium.com/coderaiser/node-socket-file "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/node-socket-file  "Build Status"

