const { Image, List, Carousel, actionssdk } = require('actions-on-google')
const app = actionssdk({ debug: true });
var helper = require('./helper');
var Speech = require('ssml-builder');

app.intent('actions.intent.MAIN', conv => {
    var speech = new Speech();
    speech.say("Hi").pause("200ms");
    speech.sentence("I am Uni, your virtual library assistant");
    speech.sentence('I can check books availability if you give me the book title.');
    speech.sentence('Ask me questions like "Is Design of Everyday thing by Don Norman" available?');
    var speechOutput = speech.ssml(true);
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
                conv.ask("There are two titles that meet this criteria");
                conv.ask(new Carousel({
                    items: {
                        // Add the first item to the list
                        ['SELECTION_KEY_BOOK1']: {
                            title: 'Lectures on Quantum Computing',
                            description: 'Published 2013',
                            image: new Image({
                                url: "https://kbimages1-a.akamaihd.net/9838527b-57d2-4895-a8f8-1d8fea4685d5/353/569/90/False/lectures-on-quantum-computing-thermodynamics-and-statistical-physics.jpg",
                                alt: 'Lectures on Quantum Computing',
                            }),
                        },
                        // Add the second item to the list
                        ['SELECTION_KEY_BOOK2']: {
                            title: 'Quantum Information and Quantum Computing',
                            description: 'Publish 2013',
                            image: new Image({
                                url: "https://images-na.ssl-images-amazon.com/images/I/51X%2BdIBIeZL._SX354_BO1,204,203,200_.jpg",
                                alt: 'Quantum Information and Quantum Computing',
                            }),
                        }
                    },
                }));
                break;
            case "FindBookIntent-selectBook":
                var bookName = result.contexts[0].parameters.book;
                console.log("bookname", bookName);
                conv.ask("Yes, " + bookName + " is available");
                break;
            case "FindBookIntent-selectBook-enquireOnlineAccess":
                var bookName = result.contexts[0].parameters.book;
                //var author = result.contexts[0].parameters.author;
                var speech = new Speech();
                speech.say("Yes, online access to students is available for " + bookName);
                var speechOutput = speech.ssml(true);
                conv.ask(speechOutput);
                break;
            case "ThankIntent":
                conv.ask("Happy reading! bye!").close();
                break;
        }
    }).catch((err) => {
        console.log(err);
        conv.ask('Something went wrong').close();
    });
});

module.exports = app;