const express = require('express')
const app = express();
var helper = require('./helper');

const port = process.env.PORT || 8880;

app.get('/test', (req, res) => {
    return helper.queryDialogflow("hi there").then((result) => {
        console.log('dfrersult', JSON.stringify(result));
        res.send("api call success");
    }).catch((err) => {
        console.log(err);
        res.send("something webnt wrong");
    });    
});

app.listen(port, () => console.log('Example app listening on port 8880!'))

