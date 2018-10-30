var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var actionsdkApp = require('./dialogflowHandlers');
var app = express();
var port = process.env.PORT || 8011;
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.post("/gatest", actionsdkApp);

app.listen(port, function() {
    console.log(`Application started listening ${port}.`);
});


