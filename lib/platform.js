const Servo = require('./servo');
const NanoTimer = require('nanotimer');

function sleep(seconds) {
    return new Promise(function (resolve, reject) {
        var timer = new NanoTimer();
        timer.setTimeout(function (x) {
            return resolve(seconds);
        }, '', seconds + 's');
    });
}

const Direction = {
    FRONT: 80,
    RIGHT: 180,
    LEFT: 0
}

const Dump = {
    OPEN: 75,
    CLOSE: 0
}

class Platform {
    constructor(rotatorId, dumperId) {
        this.rotatorId = rotatorId;
        this.dumperId = dumperId;
    }

    async rotate(direction) {
        await new Servo(this.rotatorId).turn(direction);
    }

    async dump() {
        try {
            await new Servo(this.dumperId).turn(Dump.OPEN);
            await sleep(1);
            await new Servo(this.dumperId).turn(Dump.CLOSE);
        } catch (e) {
            console.error('servo error', e)
        }
    }
}

module.exports = {
    Platform: Platform,
    Direction: Direction,
    sleep: sleep
}