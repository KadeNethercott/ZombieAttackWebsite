<?php
	session_start();
	
	if(isset($_SESSION['LAST_ACTIVITY']) && time() - $_SESSION['LAST_ACTIVITY'] > 1200)
		header("Location: http://129.123.224.49/index.php?logout=true");
		//header("Location: /group3/code/index.php?logout=true");
	$_SESSION['LAST_ACTIVITY'] = time();
	
	if(isset($_POST['username']))
	{
		$username = htmlentities($_POST['username']);
		$password = htmlentities($_POST['password']);
		setcookie("user", $username, time()+1200);
	}
	elseif(isset($_SESSION['username']))
	{
		$username = $_SESSION['username'];
	}
	
	$validusername = false;
	$validpassword = false;
	$errorno = 0;
	if(isset($username) && strpos($username, "'")===false && strpos($username, "\"")===false) //Disallowed characters
		$validusername = true;
	if(isset($password) && strpos($password, "'")===false && strpos($password, "\"")===false)
		$validpassword = true;
	
	if($validusername && $validpassword)
	{
		$sql = new mysqli("129.123.224.49", "zombieattack", "zattacksite", "cs3450");//Set up the sql connection
		//$sql = new mysqli("localhost", "zombieattack", "zattacksite", "cs3450");
		if ($sql->connect_errno) 
		{
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
		
		$passhash = hash("md5", $password);
		if($sql->query("INSERT INTO cs3450.users (username, password, type) VALUES ('$username', '$passhash', 1)")===false)
			$errorno = 1;
		
	}
	
	
?>
<!DOCTYPE html>
<html>
<head>
	<title>Sign up</title>
	<meta charset="UTF-8"/>
	<link type="text/css" rel="stylesheet" href="css/themedbootstrap.css"/>
	<link type="text/css" rel="stylesheet" href="css/chat.css" />
	<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js"></script>
	<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
	<script src="js/bootstrap.js"></script>
	<script src="js/Chat.js"></script>
</head>
<body>
	<div class="container">
		<div class="masthead">
			<div class="navbar">
				<div class="navbar-inner">
					<div class="container">
						<ul class="nav navbar-nav">
							<li class="active"><a href="profile.php">Home</a></li>
							<li><a href="maps.php">Play</a></li>
							<?php
								if(isset($_SESSION['usertype']) && $_SESSION['usertype'] > 1)
									echo "<li><a href='mapEditor.php'>Map Editor</a></li>";
								if(isset($_SESSION['usertype']) && $_SESSION['usertype'] == 3)
									echo "<li><a href='editUser.php'>Edit Users</a></li>
										  <li><a href='editMap.php'>Edit Maps</a></li>";
							?>					
						</ul>
						<ul class="nav navbar-nav navbar-right">
							<?php //Changes the Login/User button
								if(!isset($username))
									echo "<li><a href='index.php'>Login</a></li>";
								else
									echo "
										<li class='dropdown'>
											<a href='#' class='dropdown-toggle' data-toggle='dropdown'>$username</a>
											<ul class='dropdown-menu'>
												<li><a href='profile.php'>Profile</a></li>
												<li><a href='maps.php?searchtype=owned'>My Maps</a></li>
												<li><a href='index.php?logout=true'>Logout</a></li>
											</ul>
										</li>
									";
							?>
							
						</ul>
					</div>
				</div>
			</div>
		</div>
		<center>
		<?php
			if(isset($_POST['username']) && $validusername == false)
				showAlert("That username is invalid", 3);
			if(isset($_POST['password']) && $validpassword == false)
				showAlert("That password is invalid", 3);
			if($errorno == 0 && $validpassword && $validusername)
				showAlert("Account created succefully", 1);
			if($errorno == 1)
				showAlert("There was a problem registering", 3);
		?>
		<form class="form-signin" action="signup.php" method="POST">
			<div class="signIn">
				<h2 class="form-signin-heading">Enter Desired Credentials</h2>
				<input class="input-block-level" type="text" name="username" placeholder="Username"/><br/>
				<input class="input-block-level" type="password" name="password" placeholder="Password"/><br/>
				<input class="input-block-level" type="password" name="password" placeholder="Retype Password"/><br/>
				<input class="btn btn-large btn-primary"type="submit" value="Register"/>
			</div>
		</form>
		</center>
	</div>
	<div id="chatwindow" class="ui-widget-content panel-group">
		<div class="panel panel-default">
			<div class="panel-heading">
				<div class="panel-title" data-toggle="collapse" data-target="#chatbody">
					Chat
				</div>
			</div>
			
		<div id="chatbody" class="collapse in">
			<div class="panel-body">
				<div class="container">
					<div class="form-signin" id="chatForm">
						<div class="chatcolumn">
							<!-- this is where the messages will show up.-->
							<textarea rows="7" cols="45" id="chatarea" readOnly = "true" disabled ></textarea>
						</div>
						<div class="chatcolumn">
							<a id="mainchannel" class="btn channelbutton">Main</a><br/>
							<a id="editorchannel" class="btn channelbutton">Editor</a><br/>
							<a id="gamechannel" class="btn channelbutton">Game</a>
						</div><br/>
						<!--this is the place to put the messages, and submit them.-->
						<td><input type="text" size="43" id="textInput" placeholder="Put your message here.">
						<td><button class="btn-primary btn-mini" type="submit" onclick="sendMessage()">Send</button>
					</div>
				</div>
			</div>
		</div>
		</div>
	</div>
</body>
</html>

<?php
function showAlert($message, $type)
{
	$alertType = $type;
	if($type == 1)
		$alertType = "success";
	if($type == 2)
		$alertType = "warning";
	if($type == 3)
		$alertType = "danger";
	echo "<div class='alert alert-$alertType'>  
			<a class='close' data-dismiss='alert'>×</a>  
			$message 
		  </div>";
}
?>