const Servo = require('./servoSlow');
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
        this.rotator = new Servo(this.rotatorId);
        this.dumper = new Servo(this.dumperId);
    }

    async rotate(direction) {
        await this.rotator.turn(direction);
    }

    async dump() {
        try {
            await this.dumper.turn(Dump.OPEN);
            await sleep(1);
            await this.dumper.turn(Dump.CLOSE);
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