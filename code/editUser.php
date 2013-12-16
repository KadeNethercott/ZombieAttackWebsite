<!DOCTYPE html>
<?php
  session_start();
  if(isset($_SESSION['username']))
    $username = $_SESSION['username'];
  if(isset($_SESSION['password']))
    $password = $_SESSION['password'];

  $mysqli = new mysqli("129.123.224.49", "zombieattack", "zattacksite", "cs3450");

  	if (isset($_POST['delete'])) {
		foreach($_POST['checkbox'] as $del_id){
			$sql = "DELETE FROM `cs3450`.`users` WHERE id = '$del_id'"; 
			$mysqli->query($sql);
		}
	}

	if (isset($_POST['change'])) 
	{
		$i = 0;
		foreach($_POST['drop'] as $type_id)
		{
			$changeid = $_POST['changeuserid'][$i];
			$sql = "UPDATE `cs3450`.`users`
					SET `type` = $type_id
					WHERE `id` = $changeid"; 
			$mysqli->query($sql);
			$i++;
		}
	}


  $sqlStr= "SELECT username, id, type FROM `cs3450`.`users`";
  $query = mysqli_query($mysqli,$sqlStr);
?>


<html lang="en">
<head>
<meta charset="utf-8" />
<title>Welcome to Zombie Attack!</title>
<link type="text/css" rel="stylesheet" href="css/themedbootstrap.css"  />
<link type="text/css" rel="stylesheet" href="css/chat.css" />
<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js"> </script>
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
    
<form method='POST' action='editUser.php'>
<div class="panel panel-default">
 
  <div class="panel-heading">Zombie Attack! Users</div>
  <div class="panel-body">
    <p> A list of Zombie Attack Users. Delete User will delete the checked user(s).  Changing the Dropbox will change the users permissions. </p>
  </div>

  <table class="table">
  <tr>
    <th>Id</th>
    <th>Name</th>
    <th>Permission Type</th>
  </tr>




<?php

while($row = mysqli_fetch_assoc($query))
{
	echo "<tr>";
	echo "<td>"."<input name='checkbox[]' type='checkbox' value='{$row['id']}'/> ".$row['id']." ";
	echo "<input name='changeuserid[]' type='hidden' value='{$row['id']}'/></td>";
	echo "<td>".$row['username']."</td>";
	if($row['type']==1)
	{
		echo "<td>"."<select name='drop[]'>"."<option value='1'>Basic User</option>"."<option value='2' >Map Editor</option>"."<option value='3' >Admin</option>"."</select>"."</td>";
	}
	else if($row['type']==2)
	{
		echo "<td>"."<select name='drop[]'>"."<option value='2' >Map Editor</option>"."<option value='1' >Basic User</option>"."<option value='3' >Admin</option>"."</select>"."</td>";
	}
	else if($row['type']==3)
	{
		echo "<td>"."<select name='drop[]'>"."<option value='3' >Admin</option>"."<option value='1' >Basic User</option>"."<option value='2' >Map Editor</option>"."</select>"."</td>";
	}
	echo "</tr>";
}
?>


  
    
  </table>
</div>
<input id='delete' type='submit' class="btn btn-danger" name='delete' value='delete User'/>
<button class="btn-primary" type="submit">Clear Selections</button> 
<input  id='change' type='submit' class="btn-primary" name='change' value='Sumbit Changes' />


</form>
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
 
<script> //stript for clear button.
  $("button").click(function() {
  $("#checkbox").val([]);}); 
</script>


</body>
</html>