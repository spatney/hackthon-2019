const Servo = require('./lib/servo');
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
    FRONT: 90,
    RIGHT: 170,
    LEFT: 10
}

const Dump = {
    OPEN: 90,
    CLOSE: 0
}

class Platform {
    constructor(rotatorId, dumperId) {
        this.rotatorId = rotatorId;
        this.dumperId = dumperId;
    }

    rotate(direction) {
        return new Servo(this.rotatorId)
            .turn(direction)
    }

    dump() {
        return new Promise((s, e) => {
            new Servo(this.dumperId)
                .turn(Dump.OPEN)
                .then(() => {
                    setTimeout(() => {
                        new Servo(this.dumperId)
                            .turn(Dump.OPEN)
                            .then(() => s())
                            .catch(e => {
                                console.error('servo error', e);
                                e();
                            });
                    }, 2000);
                })
                .catch(e => {
                    e();
                    console.error('servo error', e)
                });
        });
    }
}

module.exports = {
    Platform: Platform,
    Direction: Direction,
    sleep: sleep
}