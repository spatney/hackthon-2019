var HOST = 'https://broker.graysense.io';

function Authenticate(config, cb) {
    fetch(HOST + '/iot/token', {
        method: 'POST',
        body: JSON.stringify(config),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(function (res) { return res.json(); })
        .then(function (result) {
            cb(result.token);
        });
};

function SocketClient(config) {
    this.config = config;
};

SocketClient.prototype.subscribe = function (cb) {
    if (this.config.token) {
        this.registerWithToken(this.config.token, cb);
    } else {
        Authenticate(this.config, (token) => {
            this.registerWithToken(token, cb);
        });
    }
}

SocketClient.prototype.registerWithToken = function (token, cb) {
    console.log('token', token)
    this.socket = io(HOST, {
        query: 'token=' + token
    });

    this.on('iot:error', e => console.log('ioterror', e));
    this.on('error', e => console.log('error', e));
    this.on('connect', () => {
        console.log('device controller connected as', this.socket.id);
        this.emit('subscribe');
        if (cb) cb();
    });
};

SocketClient.prototype.emit = function (event, data) {
    if (!this.socket) {
        console.error('Socket undefined, have you subscribed?');
        return;
    }
    this.socket.emit(event, data);
}

SocketClient.prototype.on = function (event, cb) {
    if (!this.socket) {
        console.error('Socket undefined, have you subscribed?');
        return;
    }
    this.socket.off(event);
    this.socket.on(event, cb);
}