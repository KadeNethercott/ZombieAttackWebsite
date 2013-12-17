<!-- @author Nathan Merkley -->
<?php
	session_start();
	
	if(isset($_SESSION['LAST_ACTIVITY']) && time() - $_SESSION['LAST_ACTIVITY'] > 1200)
		header("Location: /group3/code/index.php?logout=true");
		//header("Location: http://129.123.224.49/index.php?logout=true");
	$_SESSION['LAST_ACTIVITY'] = time();
	
	if(isset($_GET['logout']))//Unset all session variables, destroy the session, and generate a new one
	{
		setcookie("user", "", time()-1200);
		unset($_SESSION['username'], $_SESSION['password'], $_SESSION['userid'], $_SESSION['usertype']);
		session_regenerate_id(true);
	}
	
	if(isset($_POST['username']) && isset($_POST['password']))
	{
		$loginUser = htmlentities($_POST['username']);
		$loginPass = hash("md5", htmlentities($_POST['password']));
		
		$sql = new mysqli("localhost", "zombieattack", "*****", "*****");
		//$sql = new mysqli("129.123.224.49", "zombieattack", "*****", "*****");
		if ($sql->connect_errno) 
		{
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}
		$result = $sql->query("SELECT id,type FROM users WHERE username='$loginUser' AND password='$loginPass'");
		$resultArray = $result->fetch_row();
		if(isset($resultArray[0]))
		{
			$_SESSION['userid'] = $resultArray[0];
			$_SESSION['username'] = $loginUser;
			$_SESSION['password'] = $loginPass;
			$_SESSION['usertype'] = $resultArray[1];
			header("Location: profile.php");
		}
	}
	
	if(isset($_SESSION['username']))
	{
		$username = $_SESSION['username'];
		setcookie("user", $username, time()+3600);
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Welcome to Zombie Attack!</title>
<link type="text/css" rel="stylesheet" href="css/themedbootstrap.css"  />
<link type="text/css" rel="stylesheet" href="css/chat.css" />
<link type="text/css" rel="stylesheet" href="css/index.css" />
<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js"></script>
<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
<script src="js/bootstrap.js"></script>
<!--<script src="js/Chat.js"></script>-->
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
<img  class="logo" src="img/Logo.png" />

  <div class="container">

      <form class="searchForm" action="index.php" method="POST"> <!--"form-signin"  "input-block-level"-->
	  <div class="signIn">
        <h2 class="form-signin-heading">Please sign in</h2>
	  
        <input name="username" type="text" class="inputForm" placeholder="Username">
        <input name="password" type="password" class="inputForm" placeholder="Password">
        
        <button class="btn btn-large btn-primary" type="submit">Sign in</button> </br>
        <a href="signup.php" class="btn btn-small">New user? Click here!</a>
		</div>
      </form>
      
	</div>
</center>

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