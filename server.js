require('dotenv').config();
const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser')

const app = express();
app.set('port', 5000);
app.use(express.static(__dirname + '/'));

app.use(bodyParser.json())

webPush.setGCMAPIKey(process.env.GCM_API_KEY);

app.post('/register', function(req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
});

app.post('/sendNotification', function(req, res) {

    console.log(req.body)
    console.log(req.body.endpoint)

    webPush.sendNotification(req.body.endpoint, {
        payload: JSON.stringify({
            'title': req.body.title,
            'icon': req.body.icon,
            'body': req.body.body,
            'url': req.body.link
        }),
        userPublicKey: req.body.key,
        userAuth: req.body.authSecret,
    })
        .then(function() {
            console.log("sent push")
            res.sendStatus(201);
        }, function(err) {
            console.error('webpusherr', err);

        });

});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});