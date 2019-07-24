
const makePwmDriver = (o) => {
    try {
        return require('adafruit-i2c-pwm-driver')(o);
    } catch (e) {
        console.log('Module not found');
        return {
            setPWMFreq: () => { }
        }
    }
}
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
        this.lastAngle = undefined;
    }

    turnInternal(angle) {
        return sleep(0)
            .then(() => pwm.setPWM(this.channel, 0, (servoMin + (servoMax - servoMin) * angle / 180)))
            .then(() => sleep(0.3))
            .then(() => pwm.setPWM(this.channel, 0, 0));
    }

    async turn(angle) {
        angle = angle < minAngle ? minAngle : angle;
        angle = angle > maxAngle ? maxAngle : angle;

        if (this.lastAngle !== undefined) {
            const diff = this.lastAngle - angle;

            diff /= 10;

            for (let i = 1; i < 10; i++) {
                await this.turnInternal((this.lastAngle + (diff * i)) | 0);
            }

            this.lastAngle = angle;
            await this.turnInternal(angle);

        } else {
            this.lastAngle = angle
            await this.turnInternal(angle);
        }
    }
}

module.exports = Servo;