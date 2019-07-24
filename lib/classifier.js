const request = require('request');
const fs = require('fs');

const WasteType = {
    TRASH: 'Trash',
    RECYCLE: 'Recycle',
    COMPOST: 'Compost'
}

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
                    const result = JSON.parse(response.body.toString());
                    this.id = result.predictionId;
                    s(result);
                }
            });
        });
    }

    classify(classification) {
        console.log(`re-classify ${this.id} as ${classification}.`);
        return new Promise((s, e) => {
            request({
                url: `https://api.chriscaruso.dev/v1/identify/feedback/${this.id}`,
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                encoding: null,
                body: JSON.stringify({ wasteType: classification })
            }, (error, response, body) => {
                if (error) {
                    console.log(error)
                    e(error);
                } else {
                    console.log('response => ' + response.body.toString());
                    s();
                }
            });
        });
    }
}

module.exports = {
    Classifier: Classifier,
    WasteType: WasteType
}