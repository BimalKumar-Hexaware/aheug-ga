var express = require('express');
var bodyParser = require('body-parser');
var actionsdkApp = require('./dialogflowHandlers');
var app = express();
var port = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(actionsdkApp);

app.listen(port, function () {
	console.log(`Application started listening ${port}.`);
});


