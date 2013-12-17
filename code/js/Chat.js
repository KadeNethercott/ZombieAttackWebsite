
/*@author Nathan Merkley*/

var lastRequest = 0;
var username = "";
var currentChannel = "";
var chat;

$(document).ready(function()
{
	chat = $("#chatwindow");
	chat.draggable();
	if($("#frame").width() > 0)
		lockChat();
	else
		chat.position({
			my:"right bottom",
			at:"right bottom",
			of:document
		});
	
	username = getUsername();
	switchChannel("main");
	
	if(username != "")
		window.setInterval(getMessages, 3000);
		
	$("#textInput").keyup(function(e)
	{
		if(e.keyCode == 13)
			sendMessage();
	});	
	
	$("#mainchannel").click(function(e)
	{
		if(currentChannel != "main")
			switchChannel("main");
	});

	$("#editorchannel").click(function(e)
	{
		if(currentChannel != "editor")
			switchChannel("editor");
	});

	$("#gamechannel").click(function(e)
	{
		if(currentChannel != "game")
			switchChannel("game");
	});
	
	$(".panel-title").click(function()
	{
		lockChat();
	});
});

function switchChannel(newChannel)
{
	$("#chatarea").val("");
	lastRequest = 0;
	currentChannel = newChannel;
	getMessages();
}

function sendMessage()
{
	if(username == "")
	{
		$("#chatarea").val("You must be logged in to send messages");
		return;
	}
		
	var chatMessage = $("#textInput").val();
	if(!chatMessage == "")
	{
		$("#textInput").val("");
		$.post("/ChatRedirect.php", {action:"post", channel: currentChannel, user: username, message: chatMessage}, function(data)
		{
			
		});
		getMessages();
	}
}

function getMessages()
{
	$.post("/ChatRedirect.php", {action:"pull", channel: currentChannel, last: lastRequest}, function(data)
	{
		var response = JSON.parse(data);
		if(response.status == 0)
		{
			var messages = response.data;
			lastRequest = response.requestTime; 
			for(var i = 0; i<messages.length; ++i)
			{
				$("#chatarea").val($("#chatarea").val() + messages[i].user + ": " + messages[i].message + "\n");
				$("#chatarea").animate({ scrollTop: $('#chatarea')[0].scrollHeight}, 500);
			}
		}
		else
		{
			$("#chatarea").val("Something went wrong");
		}
	});
}
	
function getUsername()
{
	var cookies = document.cookie;
	
	var start = cookies.indexOf("user=");
	if(start == -1)
		return "";
	start += 5;
		
	var end = cookies.indexOf(";", start);
	if(end == -1)
		end = cookies.length;
	
	return cookies.substring(start, end);
}

function lockChat()
{
	window.clearInterval(interval);
	var interval = window.setInterval(function()
	{
		chat.position({
			my:"right bottom",
			at:"right bottom",
			of:$("#frame")
		});
	}, 10);
	
	window.setTimeout(function()
	{
		window.clearInterval(interval);
	}, 2000);
}