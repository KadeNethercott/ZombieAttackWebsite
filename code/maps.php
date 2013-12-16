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
?>

<!DOCTYPE html>
<html>
<head>
	<title>Maps</title>
	<meta charset="utf-8"/>
	<link type="text/css" rel="stylesheet" href="css/themedbootstrap.css"  />
	<link type="text/css" rel="stylesheet" href="css/chat.css" />
	<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js"></script>
	<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
	<link type="text/css" rel="stylesheet" href="css/maps.css" />
	<script src="js/bootstrap.js"></script>
	<script src="js/maps.js"></script>
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
		<h1>SEARCH MAPS</h1>
		<form class = "searchForm" role = "form" action="maps.php" method="POST">
			<input class="inputForm" type="text" size="50" name="mapname"/>
			<?php
				if(isset($_POST['searchby']))
					$searchby = htmlentities($_POST['searchby']);
			?>
			<select class="dropForm" name="searchby">
				<option value="name" <?php if(isset($searchby) && $searchby == "name") echo "selected";?>>By Title</option>
				<option value="owner" <?php if(isset($searchby) && $searchby == "owner") echo "selected";?>>By Author</option>
				<option value="description" <?php if(isset($searchby) && $searchby == "description") echo "selected";?>>By Description</option>
			</select>
			<input class="btn btn-large btn-primary" type="submit" value="Search"/>
		</form>
	</center>
	<br/>
	<div class="container">
		
		<div class="col-lg-7">
		<div class='mapNamesWrap' >
	<?php
		$mymaps = false;
		if(isset($_GET['searchtype']) && $_GET['searchtype'] == "owned" && isset($username))
		{
			$mymaps = true;
			$searchby = "owner";
		}
		if((isset($_POST['mapname']) && isset($searchby)) || $mymaps == true)
		{
			$sql = new mysqli("localhost", "zombieattack", "zattacksite", "cs3450");
			//$sql = new mysqli("129.123.224.49", "zombieattack", "zattacksite", "cs3450");//Set up the sql connection
			if ($sql->connect_errno) 
				exit('There was a problem connecting to the database');
					
			if(isset($_POST['mapname']))
				$search = htmlentities($_POST['mapname']);
			
			if($mymaps == true)
				$result = $sql->query("SELECT id,name,description,owner FROM maps WHERE $searchby='$username'");
			else
				$result = $sql->query("SELECT id,name,description,owner FROM maps WHERE $searchby LIKE '%$search%' AND (owner='$username' OR published=1)");
			
			$numrows = $result->num_rows;
			for($i=0; $i<$numrows; $i++)
			{
				$row = $result->fetch_row();
				//echo "<a href='/play.php?mapid={$row[0]}'>{$row[1]}</a> By {$row[3]}<br/>";
				//echo "<a href='/group3/code/play.php?mapid={$row[0]}'>{$row[1]}</a> By {$row[3]}<br/>";
				
				echo "<a class='maps' id='{$row[0]}' href='#'>{$row[1]}</a>";
			}
		}
	?>	
		</div>
		
		</div>

		<div class="col-lg-5">
			<div class="mC">
				<div class='topMap'>
					<a class="playButton">Play Map</a>
					<div class= "h1MapCanvas" id="canvasName">Map Name</div>
				</div>
					<canvas class="map" id="mapCanvas" width="375" height="375">
                        <!-- Insert fallback content here -->
					</canvas>
				<h2 class= "h1MapCanvas" id="mapAuthor"></h2>

			</div>
		
	</div>
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