var Speech = require('ssml-builder');

var self = {
    "queryDialogflow": function (rawQuery) {
        console.log('inside queryDialogflow');
        return new Promise(function (resolve, reject) {
            var options = {
                method: 'POST',
                url: config.dialogflowV1API,
                headers:
                {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + config.v1ClientAccessToken
                },
                body:
                {
                    lang: 'en',
                    query: rawQuery,
                    sessionId: '12345',
                    timezone: 'America/New_York'
                },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) {
                    console.log(error);
                    reject("Something went wrong when processing your request. Please try again.");
                }
                console.log(body);
                resolve(body.result);
            });
        });
    },
    "generateAccessToken": function () {
        return new Promise((resolve, reject) => {
            requestWithJWT({
                url: 'https://www.googleapis.com/drive/v2/files',
                jwt: {
                    email: botConfig.client_email,
                    key: botConfig.private_key,
                    scopes: ['https://www.googleapis.com/auth/cloud-platform']
                }
            }, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                resolve(body);
            });
        });
    }
};

module.exports = self;
