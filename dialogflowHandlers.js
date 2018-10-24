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

app.intent('actions.intent.TEXT', (conv, input) => {
    conv.ask('I have to integrate it with dialogflow. show some patience').close();
});

module.exports = app;