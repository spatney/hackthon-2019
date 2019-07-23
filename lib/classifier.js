const request = require('request');
const fs = require('fs');

class Classifier {

    identify(filename) {
        return new Promise((s, e) => {
            request({
                url: 'https://api.chriscaruso.dev/v1/identify',
                method: 'POST',
                headers: {
                    'cache-control': 'no-cache',
                    'content-disposition': 'attachment; filename=' + filename,
                    'content-type': 'image/jpg',
                },
                encoding: null,
                body: fs.createReadStream(filename)
            }, (error, response, body) => {
                if (error) {
                    console.log(error)
                    e(error);
                } else {
                    s(JSON.parse(response.body.toString()));
                }
            });
        });
    }

    classify(id, classification) {

    }
}

module.exports = Classifier;