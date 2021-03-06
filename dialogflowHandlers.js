const { Image, List, Carousel, actionssdk } = require('actions-on-google')
const app = actionssdk({ debug: true });
var helper = require('./helper');
var Speech = require('ssml-builder');
var _ = require('lodash');
var baseUrl = "http://ec2-18-232-207-49.compute-1.amazonaws.com:8011/";
//var baseUrl = "https://aheug-ga.herokuapp.com/";

app.intent('actions.intent.MAIN', conv => {
    var speech = new Speech();
    speech.say("Hi").pause("500ms");
    speech.sentence("I am Uni, your faculty assistant.");
    speech.sentence('I can help you in getting information about your schedule, library information and student details.');
    var speechOutput = speech.ssml();
    conv.ask(speechOutput);
});

app.intent('actions.intent.CLOSE', (conv, input) => {
    conv.ask('Happy to help you.See you later!').close();
});

app.intent('actions.intent.CANCEL', (conv, input) => {
    conv.ask('Happy to help you.See you later!').close();
});

app.intent('actions.intent.OPTION', (conv, params, option) => {
    console.log("option", option);
    console.log("params", params)
    return helper.queryDialogflow(params).then((result) => {
        console.log(JSON.stringify(result));
        var bookName = result.parameters.book;
        var speech = new Speech();
        speech.emphasis("moderate", "Yes, ").sentence(`${bookName} is available.`);
        var speechOutput = speech.ssml();
        conv.ask(speechOutput);
    }).catch((err) => {
        console.log(err);
        conv.ask('something went wrong').close();
    });
});

app.intent('actions.intent.TEXT', (conv, input) => {
    console.log("Input:", input);
    return helper.queryDialogflow(input).then((result) => {
        console.log('dfrersult', JSON.stringify(result));
        var response;
        switch (result.action) {
            case 'input.unknown':
                response = result.fulfillment.speech;
                conv.ask(response);
                break;
            case "FindBookIntent":
                var speech = new Speech();
                speech.emphasis("moderate", "Here are two titles that meet this criteria.");
                var speechOutput = speech.ssml();
                conv.ask(speechOutput);
                conv.ask(new Carousel({
                    items: {
                        // Add the first item to the list
                        ['SELECTION_KEY_BOOK1']: {
                            title: 'Lectures on Quantum Computing',
                            description: 'Published 2013',
                            image: new Image({
                                url: baseUrl + "LecturesOnQuantumComputing.png",
                                alt: 'Lectures on Quantum Computing',
                            }),
                        },
                        // Add the second item to the list
                        ['SELECTION_KEY_BOOK2']: {
                            title: 'Quantum Information and Quantum Computing',
                            description: 'Publish 2013',
                            image: new Image({
                                url: baseUrl + "QuantumInformationAndQuantumComputing.png",
                                alt: 'Quantum Information and Quantum Computing',
                            }),
                        }
                    },
                }));
                break;
            /*case "FindBookIntent-selectBook":
                var bookName = result.body.parameters.book;
                console.log("bookname", bookName);
                var speech = new Speech();
                speech.emphasis("moderate", "Yes, ").sentence(`${bookName} is available`);
                var speechOutput = speech.ssml();
                con.ask(speechOutput);
                break;*/
            case "FindBookIntent-selectBook-enquireOnlineAccess":
                var bookInfo = _.find(result.contexts, ['name', "findbookintent-followup"]);
                var bookName = bookInfo.parameters.book;
                var speech = new Speech();
                speech.emphasis("moderate", "Yes, ").sentence(`online access to students is available for ${bookName}.`);
                speech.sentence("Do you want to checkout some other title?");
                var speechOutput = speech.ssml();
                conv.ask(speechOutput);
                break;
            case "ThankIntent":
                var speech = new Speech();
                speech.emphasis("moderate", "Thanks!").sentence("Bye!");
                var speechOutput = speech.ssml();
                conv.ask(speechOutput).close();
                break;
        }
    }).catch((err) => {
        console.log(err);
        conv.ask('Something went wrong').close();
    });
});

module.exports = app;