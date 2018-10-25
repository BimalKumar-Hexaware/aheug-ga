const { Image, List, Carousel, actionssdk } = require('actions-on-google')
const app = actionssdk({ debug: true });
var helper = require('./helper');
var Speech = require('ssml-builder');

app.intent('actions.intent.MAIN', conv => {
    var speech = new Speech();
    speech.say("Hi").pause("500ms");
    speech.sentence("I am Uni, your virtual library assistant");
    speech.sentence('I can check books availability if you give me the book title.');
    speech.sentence('Ask me questions like "Is Design of Everyday thing by Don Norman available?"');
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
        var bookName = result.contexts[0].parameters.book;
        conv.ask("Yes, " + bookName + " is available");
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
                speech.emphasis("moderate", "Here are two titles that meet this criteria").break("500ms");
                var speechOutput = speech.ssml();
                con.ask(speechOutput);
                conv.ask(new Carousel({
                    items: {
                        // Add the first item to the list
                        ['SELECTION_KEY_BOOK1']: {
                            title: 'Lectures on Quantum Computing',
                            description: 'Published 2013',
                            image: new Image({
                                url: "LecturesOnQuantumComputing.jpg",
                                alt: 'Lectures on Quantum Computing',
                            }),
                        },
                        // Add the second item to the list
                        ['SELECTION_KEY_BOOK2']: {
                            title: 'Quantum Information and Quantum Computing',
                            description: 'Publish 2013',
                            image: new Image({
                                url: "QuantumInformationAndQuantumComputing.jpg",
                                alt: 'Quantum Information and Quantum Computing',
                            }),
                        }
                    },
                }));
                break;
            case "FindBookIntent-selectBook":
                var bookName = result.contexts[0].parameters.book;
                console.log("bookname", bookName);
                speech.emphasis("moderate", "Yes, ").break("500ms").say(`${bookName} is available`);
                var speechOutput = speech.ssml();
                con.ask(speechOutput);
                break;
            case "FindBookIntent-selectBook-enquireOnlineAccess":
                var bookName = result.contexts[0].parameters.book;
                //var author = result.contexts[0].parameters.author;
                var speech = new Speech();
                speech.emphasis("moderate", "Yes, ").pause("500ms").say(`online access to students is available for ${bookName}`);
                var speechOutput = speech.ssml();
                conv.ask(speechOutput);
                break;
            case "ThankIntent":
                var speech = new Speech();
                speech.emphasis("moderate", "Happy reading!").pause("500ms").say("Bye!");
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