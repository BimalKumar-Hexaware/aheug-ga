var key = require('./aheug-ga-7294f31e67e8.json');
let { google } = require('googleapis');
var async = require('async');
var request = require('request');

var self = {
    /*"queryDialogflow": function (inputText) {
        console.log("inside helper queryDialogflow");
        var data = JSON.stringify({
            "query_input": {
                "text": {
                    "text": inputText,
                    "languageCode": "en-US"
                }
            }
        });
        return new Promise(function (resolve, reject) {
            async.waterfall([
                function (cb) {
                    console.log("inside first fn");
                    let jwtClient = new google.auth.JWT(
                        key.client_email,
                        null,
                        key.private_key,
                        ['https://www.googleapis.com/auth/cloud-platform']
                    );
                    jwtClient.authorize(function (err, tokens) {
                        if (err) {
                            console.log('error', err);
                            reject(err);
                        } else {
                            console.log("tokens", tokens);
                            tokenData = tokens.token_type + ' ' + tokens.access_token;
                            console.log("token data", tokenData);
                            cb(null, tokenData);
                        }
                    });
                },
                function (tokenData) {
                    console.log("passed tokrn", tokenData);
                    var request = require("request");

                    var options = {
                        method: 'POST',
                        url: 'https://dialogflow.googleapis.com/v2/projects/aheug-ga/agent/sessions/123456789:detectIntent',
                        headers:
                        {
                            authorization: tokenData,
                            'content-type': 'application/json; charset=utf-8'
                        },
                        body: data
                    };

                    request(options, function (error, response, body) {
                        if (error) {
                            console.log("ERROR", error);
                            reject("Something went wrong");
                        };
                        console.log(body);
                        resolve(body);
                    });
                }
            ], function (error) {
                if (error) {
                    console.log("ERROR: ", error);
                    reject("Something went wrong!");
                }
            });
        });
    }*/
    "queryDialogflow": function (rawQuery) {
        console.log('inside queryDialogflow');
        return new Promise(function (resolve, reject) {
            var options = {
                method: 'POST',
                url: "https://api.dialogflow.com/v1/query?v=20150910",
                headers:
                {
                    'content-type': 'application/json',
                    authorization: 'Bearer 2c1b95987732426a8ef01991e16964cc'
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
    }
};

module.exports = self;
