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
	
	
	// var challenge = {'challenge': req.body.challenge};
	// res.status(200).type('json').send(challenge);

	
	
	console.log("Request: " + JSON.stringify(req.body));

	// Emoji Example Request: 
	// {"token":"0dHwYoxzbNs4nE5DPlUVUgCc",
	// 	"team_id":"TCR9TMHQA",
	// 	"api_app_id":"ACSLB2B7Y",
	// 	"event":{
	// 		"type":"reaction_added",
	// 		"user":"UCR6FLDAP",
	// 		"item":{
	// 			"type":"message",
	// 			"channel":"CCQQEKDFA",
	// 			"ts":"1536696271.000100"
	// 		},
	// 		"reaction":"sunglasses",
	// 		"item_user":"UCR6FLDAP",
	// 		"event_ts":"1537881959.000100"
	// 	},
	// 	"type":"event_callback",
	// 	"event_id":"EvD0AK7SJ0",
	// 	"event_time":1537881959,
	// 	"authed_users":["UCR6FLDAP"]
	// }

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
		cm1: 	emojiName,
		dh:		teamDomain+".slack.com",
		dp:		"/"+channel.id,
		dt:		"Slack Channel: "+channel.id,
		t: 		"event",
		ec: 	"slack: " + channel.id,
		ea: 	"post by " + user.id,
		ev: 	1, 
		el: 	emojiName
	};

	
	console.log("JSON.stringify data: " + JSON.stringify(data));
	
	//Make Post Request	
	request.post("https://www.google-analytics.com/collect?" + qs.stringify(data), 
		function(error, resp, body){
		console.log("Response: " + JSON.stringify(resp));
		console.log("Body: " + JSON.stringify(body));
		console.log("Error: " + JSON.stringify(error));
	})
	res.send("OK");
	
});

//Start Server
app.listen(port, function () {
	console.log('Listening on port ' + port); 
});
