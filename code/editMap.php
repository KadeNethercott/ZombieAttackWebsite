
<!-- @author Jeremy desser -->
<!DOCTYPE html>
<?php
  session_start();
  if(isset($_SESSION['username']))
    $username = $_SESSION['username'];
  if(isset($_SESSION['password']))
    $password = $_SESSION['password'];

  $mysqli = new mysqli("129.123.224.49", "zombieattack", "*****", "*****");
  
	if (isset($_POST['delete'])) {
		foreach($_POST['checkbox'] as $del_id){
			$sql = "DELETE FROM `cs3450`.`maps` WHERE id = '$del_id'"; 
			$mysqli->query($sql);
		}
	}
	
  $sqlStr= "SELECT id,name, owner, description FROM `cs3450`.`maps`";
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
    
<form method='POST' action='editMap.php'>
<div class="panel panel-default">
 
  <div class="panel-heading">Zombie Attack! Maps</div>
  <div class="panel-body">
    <p> A list of Zombie Attack maps Created by users. Delete Map will delete the checked map(s).  </p>
  </div>

  <table class="table">
  <tr>
    <th>Id</th>
    <th>Map Name</th>
    <th>Creator</th>
    <th>Map Description</th>
  </tr>

<?php
while($row = mysqli_fetch_assoc($query)){
   
  echo "<tr>";
  echo "<td>"."<input name='checkbox[]' type='checkbox' value='{$row['id']}'/> ".$row['id']." </td>";
  echo "<td>".$row['name']."</td>";
  echo "<td>".$row['owner']."</td>";
  echo "<td>".$row['description']."</td>";
  echo "</tr>";
 
}

?>
 
  </table>
</div>
<input id='delete' type='submit' class="btn btn-danger" name='delete' value='delete Map'/>
<button name='clear' class="btn-primary" type="submit">Clear Selections</button>



<script> //stript for the clear button.
  $("button").click(function() {
  $("#checkbox").val([]);});
</script>

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

</body>
</html>