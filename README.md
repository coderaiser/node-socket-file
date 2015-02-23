# Socket-file

File processing with help of [socket.io](http://socket.io "Socket.io").

## Install

```
npm i socket-file --save
```

## How to use?

```js
var socketFile = require('socket-file'),
    
    http        = require('http'),
    express     = require('express'),
    io          = require('socket.io'),
    app         = express(),
    server      = http.createServer(app);

socket          = io.listen(server),
server.listen(port, ip);

socketFile(socket, {
    prefix: 'edward',
    size: '512000' /* max file size for patch */
});
```

## License

MIT
