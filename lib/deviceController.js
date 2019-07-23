const internalIp = require('internal-ip');
const publicIp = require('public-ip');
const Classifier = require('./classifier');

async function runDemo() {
    const platformLib = require('./platform');

    const platform = new platformLib.Platform(0, 1);
    const sleep = platformLib.sleep;
    const Direction = platformLib.Direction;
    await platform.rotate(Direction.FRONT);
    await sleep(0.1);
    await platform.dump();
    await sleep(1);

    await platform.rotate(Direction.RIGHT);
    await sleep(0.1);
    await platform.dump();
    await sleep(1);

    await platform.rotate(Direction.LEFT);
    await sleep(0.1);
    await platform.dump();
    await sleep(1);

    await platform.rotate(Direction.FRONT);
}

//runDemo();

class DeviceController {
    constructor(socket) {
        this.socket = socket;
    }

    async execCommand(command) {
        switch (command.device) {
            case 'ip':
                this.socket.emit('ip_result', {
                    //public: await publicIp.v4(),
                    internal: await internalIp.v4()
                });
                break;

            case 'demo':
                await runDemo();
                break;
            case 'identify':
                console.log(await new Classifier().identify('cam.jpg'));
                break;
            default: console.error('command unknown', JSON.stringify(command));
        }
    }
}

module.exports = DeviceController;