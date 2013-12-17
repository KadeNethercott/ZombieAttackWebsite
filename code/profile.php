
<!-- @author Michael Kushlan -->
<?php
	session_start();
	
	if(!(isset($_SESSION['username'])))
		header("Location: index.php");
	
	if(isset($_POST['updateInfo']))
	{
		$sql = new mysqli("localhost", "zombieattack", "*****", "*****");
		$abInfo = $_POST['abInfo'];
		echo $abInfo;
		$avImage = $_POST['avImage'];
		$usname = json_decode($_POST['usname']);
	
		$sql->query("UPDATE users SET image='$avImage', aboutInfo='$abInfo' WHERE username='$usname'");
	}
	
	$sql = new mysqli("localhost", "zombieattack", "*****", "*****");
	if ($sql->connect_errno) 
	{
		printf("Connect failed: %s\n", $mysqli->connect_error);
		exit();
	}
	
	if(isset($_SESSION['username']))
	{
		$username = $_SESSION['username'];
	}
	if(isset($_SESSION['password']))
	{
		$password = $_SESSION['password'];
	}
	

?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Profile</title>


<link type="text/css" rel="stylesheet" href="css/themedbootstrap.css"  />
<link rel="stylesheet" href="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.0/themes/le-frog/jquery-ui.css" />
<link type="text/css" rel="stylesheet" href="css/chat.css" />
<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js"></script>
<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
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
<img  class="logo2" src="img/Logo.png" alt="Zombie Logo" />
</center>
			
		<hr/>
		<div class="container">
			<div class="row">
				<div class= "col-md-4">
				<ul class="nav nav-tabs">
							<li class="dropdown">
								<a class="dropdown-toggle" data-toggle="dropdown" href="#" ><h2 class="text-center"><?php
					if(isset($username))
					{
						echo "$username";
						echo "'s";
					}
					?>
					Profile</h2>
								</a>
									<ul class="dropdown-menu">
										<li id="editprofile"><a href="#" >Edit profile</a></li>
										
									</ul>
							</li>
				</ul>
				
				<br>
					
					<div class="row text-centered">
					<img src="<?php if(isset($username))
								{
									$avatarImg = $sql->query("SELECT image FROM users WHERE username='$username' AND password='$password'")->fetch_row()[0];
									$avatarImg = trim($avatarImg);
									echo "img/$avatarImg"; //get from database
								}
								else
								{
									echo "img/zombie-03.png"; //default profile image
								}
								?>
								" alt="zom1" >
					</div>
					<br>
					<div class="row text-centered">
					<hr>
					<h4 class="text-center"> About </h4>
					<hr>
					<?php
					if(isset($username))
					{
						$userInfo = $sql->query("SELECT aboutInfo FROM users WHERE username='$username' AND password='$password'")->fetch_row()[0];
						echo $userInfo;
					}
					?>
					</div>
				</div>
				
				<div class="col-md-4" id="upmaps">
					
					<h2 class="text-center">Published Maps</h2>
					
				
				</div>
				
				<div class="col-md-4-4" id="pmaps">
				
					<h2 class="text-center">Unpublished Maps</h2>
					
				</div>
				
			</div>
			
		</div>
		
		<div  class= "dialog-editprofile" id="dialog-form" title="Edit Profile">
					  <form class="d-forms" id="editprofileform">
					  <fieldset>
						<label>Select Profile Avatar</label>
						<br>
						<input type="radio" name="group1" id="av1" value="1" checked> 1
						<input type="radio" name="group1" id="av2" value="2"> 2
						<input type="radio" name="group1" id="av3" value="3"> 3
						<input type="radio" name="group1" id="av4" value="4"> 4
						<br> 
					 
						<label for="aboutInfo" >Enter About Info</label>
						<textarea name="aboutInfo" id="aboutInfo" form="editprofileform"></textarea>
 					 
 					 </fieldset>
 					 </form>
					 <p class="errors"></p>
		</div>
			
		<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
		<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
		<script>
			
					$('img').each(function(){
						$(this).width($(this).width() * 0.1);
				});
		</script>
		
		<script src="js/bootstrap.js"></script>
		<script src="js/profile.js"></script>
		<script type="text/javascript">
		window.username = '<?php echo json_encode($username);?>'; // Here we store the username so we can access it in javascript
		</script>
		
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
