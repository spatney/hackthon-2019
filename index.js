

const SpiderSocket = require('spider-device');
const DeviceController = require('./lib/deviceController');

const socket = new SpiderSocket({
    appId: 'bcabd300-42f3-462c-934e-e618033cabc6',
    uid: 'bin'
});

const deviceController = new DeviceController(socket);

socket.register(() => {
    console.log('registered');
    socket.on('command', command => {
        console.log('running command', command);
        deviceController.execCommand(command);
    });
});