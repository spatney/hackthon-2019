const internalIp = require('internal-ip');
const publicIp = require('public-ip');
const ClassifierLib = require('./classifier');
const Camera = require('./camera');
const platformLib = require('./platform');

const WasteType = ClassifierLib.WasteType;
const Direction = platformLib.Direction;
const sleep = platformLib.sleep;

const classifier = new ClassifierLib.Classifier();
const platform = new platformLib.Platform(0, 1);

let flowRunning = false;

async function runDemo() {

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

async function reset() {
    await platform.rotate(Direction.FRONT);
}

async function flow() {
    if (flowRunning) return;
    flowRunning = true;
    try {
        await new Camera().click();

        const result = await classifier.identify('cam.jpg');
        const predictions = result.predictions;

        let max = predictions[0].score;
        let type = predictions[0].wasteType;

        for (let i = 1; i < predictions.length; i++) {
            if (max < predictions[i]) {
                max = predictions[i].score;
                type = predictions[i].wasteType;
            }
        }

        console.log(`I think this is ${type} cos it scored ${max}.`);

        switch (type) {
            case WasteType.TRASH:
                await platform.rotate(Direction.RIGHT);
                await sleep(0.1);
                await platform.dump();
                //await sleep(1);
                break;

            case WasteType.RECYCLE:
                await platform.rotate(Direction.FRONT);
                await sleep(0.1);
                await platform.dump();
                //await sleep(1);
                break;

            case WasteType.COMPOST:
                await platform.rotate(Direction.LEFT);
                await sleep(0.1);
                await platform.dump();
                //await sleep(1);
                break;

            default: console.error(`${type} not found`);
        }

        await reset();
        flowRunning = false;
        return {
            score: max,
            type: type
        }
    } catch (error) {
        flowRunning = false;
        console.log('flow failed', error);
    }

}

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
                console.log(await classifier.identify('cam.jpg'));
                break;

            case 'classify':
                classifier.classify(command.data);
                break;

            case 'camera':
                new Camera().click();
                break;

            case 'flow':
                const result = await flow();
                if (result) {
                    this.socket.emit('identify_result', result);
                }
                break;
            default: console.error('command unknown', JSON.stringify(command));
        }
    }
}

module.exports = DeviceController;