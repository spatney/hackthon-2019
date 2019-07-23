const makePwmDriver = require('adafruit-i2c-pwm-driver')// use this one in rea$
const NanoTimer = require('nanotimer');

function sleep(seconds) {
    return new Promise(function (resolve, reject) {
        var timer = new NanoTimer();
        timer.setTimeout(function (x) {
            return resolve(seconds);
        }, '', seconds + 's');
    });
}
const pwm = makePwmDriver({ address: 0x40, device: '/dev/i2c-1', debug: false });
const servoMin = 150 // Min pulse length out of 4096
const servoMax = 600 // Max pulse length out of 4096
const minAngle = 20;
const maxAngle = 160;

pwm.setPWMFreq(50);

class Servo {
    constructor(channel) {
        this.channel = channel;
    }

    turn(angle) {
        angle = angle < minAngle ? minAngle : angle;
        angle = angle > maxAngle ? maxAngle : angle;

        return sleep(0)
            .then(() => pwm.setPWM(this.channel, 0, (servoMin + (servoMax - servoMin) * angle / 180)))
            .then(() => sleep(0.3))
            .then(() => pwm.setPWM(this.channel, 0, 0));
    }
}

module.exports = Servo;