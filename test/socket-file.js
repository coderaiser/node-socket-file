import {join, dirname} from 'node:path';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';
import {tryToCatch} from 'try-to-catch';
import {test} from 'supertape';
import {socketFile, getHash} from '../lib/socket-file.js';
import Connect from './connect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const connect = Connect('socket-file', socketFile);

test('socket-file: options: prefix', async (t) => {
    const socket = await connect('/', {
        prefix: 'hello',
    });
    
    await once(socket, 'connect');
    
    t.pass('connected with prefix');
    t.end();
});

test('socket-file: options: root', async (t) => {
    const socket = await connect('/', {
        root: __dirname,
    });
    
    await once(socket, 'connect');
    const name = String(Math.random());
    
    socket.emit('patch', name, 'hello world');
    
    const [error] = await once(socket, 'err');
    
    t.ok(error);
    t.end();
});

test('socket-file: options: empty object', async (t) => {
    const socket = await connect('/', {});
    await once(socket, 'connect');
    
    t.pass('success');
    t.end();
});

test('socket-file: options: auth not function', async (t) => {
    const auth = {};
    const [error] = await tryToCatch(connect, '/', {
        auth,
    });
    
    t.equal(error.message, 'auth should be function!', 'should throw when auth not function');
    t.end();
});

test('socket-file: options: auth: wrong credentials', async (t) => {
    const auth = (accept, reject) => () => {
        reject();
    };
    
    const socket = await connect('/', {
        auth,
    });
    
    socket.emit('auth', 'jhon', 'lajoie');
    
    await once(socket, 'reject');
    
    t.pass('should reject');
    t.end();
});

test('socket-file: options: auth: correct credentials', async (t) => {
    const auth = (accept) => () => {
        accept();
    };
    
    const socket = await connect('/', {
        auth,
    });
    
    socket.emit('auth', 'hello', 'world');
    
    await once(socket, 'connect');
    
    t.pass('should grant access');
    t.end();
});

test('socket-file: getHash', async (t) => {
    const fixturePath = join(__dirname, 'fixture', 'hash.zip');
    const hash = await getHash(`${fixturePath}/hello.txt`);
    
    t.equal(hash, '22596363b3de40b06f981fb85d82312e8c0ed511');
    t.end();
});
