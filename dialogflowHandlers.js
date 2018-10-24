const { List, actionssdk } = require('actions-on-google')
const app = actionssdk({ debug: true });
var helper = require('./helper');

app.intent('actions.intent.MAIN', conv => {
    conv.ask('<speak>Hi <break time="200ms"/> I am Uni, your virtual library assistant. I can check books availability if you give me the book title. Ask me questions like "Is Design of Everyday thing by Don Norman" available?</speak>');
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
    switch (option) {
        case 'SELECTION_KEY_ONE':

            break;
        case 'SELECTION_KEY_TWO':

            break;
    }
});

app.intent('actions.intent.TEXT', (conv, input) => {
    console.log("Input:", input);
    return helper.queryDialogflow(conv.input.raw).then((result) => {
        console.log('dfrersult', JSON.stringify(result));
        var response;
        switch (result.action) {
            case 'input.unknown':
                response = result.fulfillment.speech;
                conv.ask(response);
                break;
            case "FindBookIntent":
                conv.ask(new List({
                    title: 'There are two titles that meet this criteria',
                    items: {
                        // Add the first item to the list
                        ['SELECTION_KEY_ONE']: {
                            title: 'Lectures on Quantum Computing',
                            description: 'Lectures on Quantum Computing by Mikio and Tanaka 2013',
                            image: new Image({
                                url: "https://kbimages1-a.akamaihd.net/9838527b-57d2-4895-a8f8-1d8fea4685d5/353/569/90/False/lectures-on-quantum-computing-thermodynamics-and-statistical-physics.jpg",
                                alt: 'Lectures on Quantum Computing',
                            }),
                        },
                        // Add the second item to the list
                        ['SELECTION_KEY_TWO']: {
                            title: 'Quantum Information and Quantum Computing',
                            description: 'Quantum Information and Quantum Computing by Mikio and Sasaki, 2013',
                            image: new Image({
                                url: "https://images-na.ssl-images-amazon.com/images/I/51X%2BdIBIeZL._SX354_BO1,204,203,200_.jpg",
                                alt: 'Quantum Information and Quantum Computing',
                            }),
                        }
                    },
                }));
                break;
            case "FindBookIntent-selectBook":
                var bookName = result.contexts[0].parameters.bookName;
                conv.ask("Yes, " + bookName + " is available");
                break;
            case "FindBookIntent-selectBook-enquireOnlineAccess":
                conv.ask("yes online access to students is available for ‘Lectures on Quantum Computing' by Mikio and Tanaka");
                break;
            case "ThankIntent":
                conv.ask("Happy reading, bye bye!");
                break;
        }
    }).catch((err) => {
        conv.ask('something went wrong').close();
    });
});

module.exports = app;