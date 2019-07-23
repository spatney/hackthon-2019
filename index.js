const platformLib = require('./lib/platform');

const platform = new platformLib.Platform(0, 1);
const sleep = platformLib.sleep;
const Direction = platformLib.Direction;

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

runDemo();