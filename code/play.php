
<!-- @author Nathan Merkley -->
<?php
	session_start();
	
	if(isset($_SESSION['LAST_ACTIVITY']) && time() - $_SESSION['LAST_ACTIVITY'] > 1200)
		header("Location: /group3/code/index.php?logout=true");
		//header("Location: http://129.123.224.49/index.php?logout=true");
	$_SESSION['LAST_ACTIVITY'] = time();
	
	if(isset($_SESSION['username']))
	{
		$username = $_SESSION['username'];
		setcookie("user", $username, time()+1200);
	}
	if(isset($_SESSION['password']))
		$password = $_SESSION['password'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Welcome to Zombie Attack!</title>
<link type="text/css" rel="stylesheet" href="css/themedbootstrap.css"  />
<link type="text/css" rel="stylesheet" href="css/chat.css" />
<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js"></script>
<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
<script src="js/bootstrap.js"></script>

<!--<script src="js/Chat.js"></script> -->
</head>
 
<body>

<div class="container" id="maincontainer">

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
	if(isset($username) && isset($_GET['mapid']))
	{
		
		$result = postmap($_GET['mapid'], $username);
		if($result['success'] == false)
			echo "Something went wrong";
		else
		{
			$url = $result['url'];
			//$width = $result['width']*40;
			//$height = $result['height']*40;
			echo "
				<iframe id='frame' src='$url' style='width: 100%;'
				scrolling='no' marginwidth='0' marginheight='0' frameborder='0' vspace='0' hspace='0'></iframe>
			";
		}
	}
  ?>
</center>
<script>
	$(document).ready(function()
	{
		var frame = $("#frame");
		frame.focus();
		frame.height(window.innerHeight - 125);
	});
</script>

<div id="chatwindow" class="ui-widget-content panel-group">
	<div class="panel panel-default">
		<div class="panel-heading">
			<div class="panel-title" data-toggle="collapse" data-target="#chatbody">
				Chat
			</div>
		</div>
		
	<div id="chatbody" class="collapse">
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
</div>
</body>
</html>

<?php
function postmap($mapID, $owner) //Largely copied from database.php
{
	//$sql = new mysqli("129.123.224.49", "zombieattack", "*****", "*****");//Set up the sql connection
	$sql = new mysqli("localhost", "zombieattack", "*****", "*****");
	
	if ($sql->connect_errno) 
		return array("success" => false);

	$result = $sql->query("SELECT mapjson FROM maps WHERE id='$mapID'");
	$resultArray = $result->fetch_row();
	if(!isset($resultArray[0]))
		return array("success" => false);
		
	$mapdata = $resultArray[0];
	
	$httpparams = array('http' => array(
		'method' => 'POST',
		'header'=> "Content-type: application/json\r\n",
		'content' => "{\"map\":$mapdata}"
			));
	$context = stream_context_create($httpparams);
	$stream = fopen("http://zombie-attack.aws.af.cm/uploadMap/ebf5bd5f-5ee3-c04e-2792-c9f4a02f794c", 'r', false, $context);
	if(!$stream){
		echo "<p>file not found</p>";
	}
	$return = json_decode(stream_get_contents($stream), true);
	fclose($stream);
	
	if($return['success'] == false)
		return array("success" => false);
		
	$url = $return['url'];
	$decodedmap = json_decode($mapdata, true);
	$width = $decodedmap['width'];
	$height = $decodedmap['height'];
	
	return array("success" => true, "url" => $url, "width" => $width, "height" => $height);
}
?>