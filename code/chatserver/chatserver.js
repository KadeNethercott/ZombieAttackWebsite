'use strict';

var commands = 
{
	'/':defaultPage,
	'/pull':pullMessages,
	'/post':postMessage
};

var chat = {
		"main":[],
		"editor":[],
		"game":[]
		};

var server = require('http').createServer(handleRequest);
var urltool = require('url');
var querystring = require('querystring');
server.listen(3000);

function handleRequest(request, response)
{
	var url = urltool.parse(request.url, true);
	if(commands[url.pathname])
	{
		commands[url.pathname](request, response, url);
	}
	else
	{
		console.log(request.connection.remoteAddress + " tried command " + url.pathname + " 404");
		response.writeHead(404);
		response.write('{"status": -1, "message":"invalid command"}');
		response.end();
	}
}

function defaultPage(request, response, url)
{
	console.log(request.connection.remoteAddress + " pinged the server");
	response.writeHead(200);
	response.write('{"status": 0, "message":"Connection successfull"}');
	response.end();
}

function pullMessages(request, response, url)
{
	var remoteAddress = request.connection.remoteAddress;
	if(!chat[url.query.channel])
	{
		response.writeHead(200);
		response.write('{"status": -4, "message": "Must specify a valid channel"}');
		response.end();
		console.log(remoteAddress + " Tried to pull messages from invalid channel " + url.query.channel);
		return;
	}
	
	var channel = chat[url.query.channel];
	var time = Date.now();
	var lastTime = 0;
	var messages = [];
	
	if(url.query.last)
		lastTime = url.query.last;
	
	for(var i = 0; i < channel.length; ++i)
	{
		if(channel[i].time > lastTime)
			messages.push(channel[i]);
	}
	
	var ret = {
		status: 0,
		message: "Pulled messages successfully",
		data: messages,
		requestTime: time
	};
	
	response.writeHead(200);
	response.write(JSON.stringify(ret));
	response.end();
	console.log(remoteAddress + " Pulled messages from " + url.query.channel + " " + lastTime);
}

function postMessage(request, response, url)
{
	var remoteAddress = request.connection.remoteAddress;
	if(!request.method == "POST")
	{
		response.writeHead(400);
		response.write('{"status": -2, "message":"Must use POST to send messages"}');
		response.end();
		return;
	}
	
	var recievedData = '';
	request.on('data', function(data)
	{
		recievedData += data;
		if(recievedData >= 1e6) //1e6 is about one MB
		{
			response.writeHead(413); //Destroy connection if message is huge
			response.write('{"status": -3, "message":"Message is too large"}');
			response.end();
			request.connection.destroy();
			return;
		}
	});
	request.on('end', function()
	{
		var data = querystring.parse(recievedData);
		
		if(!data.user || !data.message || !data.channel)
		{
			response.writeHead(400);
			response.write('{"status": -5, "message": "Incomplete arguments"}');
			response.end();
			return;
		}
		if(!chat[data.channel])
		{
			response.writeHead(200);
			response.write('{"status": -4, "message": "Must specify a valid channel"}');
			response.end();
			return;
		}
		
		var newMessage = {
			user: data.user, 
			time: Date.now(),
			message: data.message
			};
			
		chat[data.channel].push(newMessage);
		response.writeHead(200);
		response.write('{"status": 0, "message":"Message posted successfully"}');
		response.end();
		
		console.log(remoteAddress + " posted a message from " + data.user);
	});
}