class Camera {
    click() {
        return new Promise((s, e) => {

            console.log('taking picture');

            var exec = require('child_process').exec;
            exec('raspistill -t 10 -vf -hf -o cam.jpg && convert cam.jpg -crop 1700x1360+469+440 cam.jpg', function (error, stdout, stderr) { 
                s(); 
                console.log('picture taken', stdout);
            });
        });
    }
}

module.exports = Camera;