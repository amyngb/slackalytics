//Set up Reqs
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var qs = require('querystring');

//set up heroku environment variables
var env_var = {
	ga_key: process.env.GOOGLE_ANALYTICS_UAID
};

//Server Details
var app = express();
var port = process.env.PORT || 3000;

//Set Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


//Routes
app.get('/', function(req, res){
	res.send('here I am');
	
});

app.post('/collect', function(req, res){
	
	console.log(req);
	// var challenge = {'challenge': req.body.challenge};

    // res.status(200).type('json').send(challenge);

	var channel = {
		id: 	req.body.event.item.channel,
	};
	var user = {
		id: 	req.body.event.user
	};
	
	var teamDomain = req.body.team_id;

	var emojiName = req.body.event.reaction;


	//Structure Data
	var data = {
		v: 		1,
		tid: 	env_var.ga_key,
		cid: 	user.id,
		ds:  	"slack", //data source
		cs: 	"slack", // campaign source
		cd1: 	user.id,
		cd2: 	channel.id,
		cm1: 	emojiCount,
		dh:		teamDomain+".slack.com",
		dp:		"/"+channel.id,
		dt:		"Slack Channel: "+channel.id,
		t: 		"event",
		ec: 	"slack: " + channel.id,
		ea: 	"post by " + user.id,
		ev: 	1 
	};
	console.log(JSON.stringify(data));
	console.log(req.body);
	//Make Post Request	
	request.post("https://www.google-analytics.com/collect?" + qs.stringify(data), 
		function(error, resp, body){
		console.log(error);
	})
	
});

//Start Server
app.listen(port, function () {
	console.log('Listening on port ' + port); 
});
