
<!-- @author Nathan Merkley -->
<!DOCTYPE HTML>
<html>

<head>

		<link type = "text/css" rel="stylesheet" href="css/themedbootstrap.css"  />
		
		<script src = "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
				<script src = "js/bootstrap.js"></script>
		
		

		<script>
		//toggles the chat window.
		$(document).ready(function(){
		  $("button").click(function(){
		    $("form").toggle();
		  });
		});
		</script>

</head>
		




<body>

	
		
	<button type="button" class="btn" data-toggle="button" >Toggle Chat</button>
		<div class="container">

	  <div class="form-signin" id="chatForm">
      <!--<form class="form-signin" id= "chatForm" hidden="true">-->
      
	        <h4 class="chatHeading">Chat here:</h4>
	        <h5 class="chatHeading" id="chat2"align="right"> chatters:</h5></br>
	    
	        <!-- this is where the messages will show up.-->
			  <textarea rows="7" cols="40" id="chatarea" readOnly ="true" disabled></textarea>

			  <!-- this is a list of the chatters online.-->
				<textarea rows="7" cols="10" readOnly ="true" disabled></textarea></br>

				<!--this is the place to put the messages, and submit them.-->
			  <input type="text" size="43" id="textInput" placeholder="Put your message here.">
			<button class="btn-primary btn-mini" type="submit" onclick="sendMessage()">Send</button>
      </div>
	
    </div>

<script>
	var lastRequest = 0;
	var username = getUsername();
	
	if(username != "")
		window.setInterval(getMessages, 3000);
	
	$("#textInput").keyup(function(e)
	{
		if(e.keyCode == 13)
			sendMessage();
	});
	
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
			$.post("/ChatRedirect.php", {action:"post", channel: "main", user: username, message: chatMessage}, function(data)
			{
				
			});
			getMessages();
		}
	}
	
	function getMessages()
	{
		$.post("/ChatRedirect.php", {action:"pull", channel: "main", last: lastRequest}, function(data)
		{
			var response = JSON.parse(data);
			if(response.status == 0)
			{
				var messages = response.data;
				lastRequest = response.requestTime; 
				for(var i = 0; i<messages.length; ++i)
				{
					$("#chatarea").append(messages[i].user + ": " + messages[i].message + "\n");
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
</script>

</body>

</html>