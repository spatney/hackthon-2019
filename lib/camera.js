class Camera {
    click() {
        return new Promise((s, e) => {

            console.log('taking picture');

            var exec = require('child_process').exec;
            exec('raspistill -vf -hf -o cam.jpg', function (error, stdout, stderr) { 
                s(stdout); 
                console.log('picture taken');
            });
        });
    }
}

module.exports = Camera;