<!-- @author Nathan Merkley and Kade Nethercott -->

<?php
session_start();

//This first block allows a username and password to be sent with the request so that redirects work
if(isset($_POST['username']) && isset($_POST['password']))
{
	$_SESSION['username'] = $_POST['username'];
	$_SESSION['password'] = $_POST['password'];
	if(isset($_POST['userid']))
		$_SESSION['userid'] = $_POST['userid'];
	if(isset($_POST['unhashedpass']))
		$_SESSION['password'] = hash("md5", $_SESSION['password']);
}

	$sql = new mysqli("localhost", "zombieattack", "*****", "*****");
	//$sql = new mysqli("129.123.224.49", "zombieattack", "*****", "*****");//Set up the sql connection
if ($sql->connect_errno) 
	exit('{"status": -4, "message": "Connection failure"}');
	
if(isset($_SESSION['userid'])) //Get session variables if they are set
	$uid = $_SESSION['userid'];
if(isset($_SESSION['password']))
	$pass = $_SESSION['password'];
if(isset($_SESSION['username']))
	$username = $_SESSION['username'];

$utype = 1; //User's permissions, will be one(player) until login is checked

if(isset($_POST['action']))
{
	if(!isset($username))
		exit('{"status": -5, "message": "User not logged in"}');
	if(!checkLogin())//Double check the user's credentials
		exit('{"status": -3, "message": "Invalid login"}');
		
	$action = $_POST['action'];
	if($action == "savemap")
		savemap();
	if($action == "loadmap")
		loadmap();
	if($action == "postmap")
		postmap();
	if($action == "getownedmaps")
		getOwnedMaps();
	if($action == "getusercredentials")
		getUserCredentials();
	if($action == "publishmap")
		publishMap();
	if($action == "hidemap")
		hideMap();
	if($action == "getPlayableMap")
		getPlayableMap();
	if($action == "getPublishedMaps")
		getPublishedMaps();
	if($action == "getUnpublishedMaps")
		getUnpublishedMaps();
		
	exit('{"status":-1, "message":"Bad action"}');
}
else
	exit('{"status": -1, "message": "No action specified"}');
	
//Requires title, and data to be set at minimum
function savemap()
{
	global $sql, $username, $uid, $pass, $utype;

	if(isset($_POST['title']) && isset($_POST['data']))
	{
		if($utype < 2)
			exit('{"status": -6, "message": "User does not have designer rights"}');
			
		$title = $_POST['title'];
		$data = $_POST['data'];
		$overwrite = false;
		$description = "";

		if(isset($_POST['overwrite']))
			$overwrite = $_POST['overwrite'];
		//echo "$overwrite";
		if(isset($_POST['description']))
			$description = $_POST['description'];
			
		$query = "INSERT INTO maps (name, owner, mapjson, description) VALUES ('$title', '$username', '$data', '$description')";
		if($overwrite == true)
			$query = "REPLACE INTO maps (name, owner, mapjson, description) VALUES ('$title', '$username', '$data', '$description')";
		if(!$sql->query($query))
		{
			$err = $sql->error;
			$errno = $sql->errno;
			exit("{\"status\": -7, \"message\": \"$errno: $err\"}"); //This needs special treatment to be able to place a variable in it
		}
		
		exit('{"status": 0, "message": "Saved successfully"}');
	}
	else
		exit('{"status": -2, "message": "Missing arguments"}');
}

//Desired maps name goes into 'title'
function loadmap()
{
	global $sql, $username, $utype;
	
	if(!isset($_POST['title']))
		exit('{"status": -2, "message": "Missing arguments"}');

	if($utype < 2)
		exit('{"status": -6, "message": "User does not have designer rights"}');
	
	$title = $_POST['title'];
	$result = $sql->query("SELECT mapjson FROM maps WHERE name='$title' AND owner='$username'");
	$resultArray = $result->fetch_row();
	if(isset($resultArray[0]))
	{
		$mapdata = $resultArray[0];
		exit("{\"status\":0, \"data\": $mapdata, \"message\": \"Map loaded successfully\"}");
	}
	else
		exit("{\"status\": -8, \"message\": \"Map '$title' does not exist for user $username\"}");
}

//Just needs title to be set
function postmap()
{
	global $sql, $username;
	
	if(!isset($_POST['title']))
		exit('{"status": -2, "message": "Missing arguments"}');
	$title = $_POST['title'];
	
	$result = $sql->query("SELECT mapjson FROM maps WHERE name='$title' AND owner='$username'");
	$resultArray = $result->fetch_row();
	if(!isset($resultArray[0]))
		exit("{\"status\": -8, \"message\": \"Map '$title' does not exist for user $username\"}");
		
	$mapdata = $resultArray[0];
	
	$httpparams = array('http' => array(
		'method' => 'POST',
		'header'=> "Content-type: application/json\r\n",
		'content' => "{\"map\":$mapdata}"
			));
	$context = stream_context_create($httpparams);
	$stream = fopen("http://zombie-attack.aws.af.cm/uploadMap/ebf5bd5f-5ee3-c04e-2792-c9f4a02f794c", 'r', false, $context);
	
	$return = json_decode(stream_get_contents($stream), true);
	fclose($stream);
	
	if($return['success'] == false)
	exit("Something went wrong");
	$url = $return['url'];
	$decodedmap = json_decode($mapdata, true);
	$width = $decodedmap['width'];
	$height = $decodedmap['height'];
	
	exit("{\"status\":0, \"mesage\":\"Map posted successfully!\", \"url\":\"$url\", \"width\":$width, \"height\":$height}");
}

function checkLogin()
{
		global $sql, $uid, $username, $pass, $utype;
		$result = $sql->query("SELECT id,type FROM users WHERE username='$username' AND password='$pass'");
		$resultArray = $result->fetch_row();
		$result->close();
		if(isset($resultArray[0]))
		{
			$uid = $resultArray[0];
			$utype = $resultArray[1];
			return true;
		}
		else
			return false;
}

//Returns an array of all the logged in users maps
//indices are 'id', 'name', and 'description'
function getOwnedMaps()
{
	global $sql, $username;
	$result = $sql->query("SELECT id,name,description FROM maps WHERE owner='$username'");
	$numrows = $result->num_rows;
	$ret = [];
	for($i=0; $i<$numrows; $i++)
	{
		$row = $result->fetch_row();
		$next = array();
		$next['id'] = $row[0];
		$next['name'] = $row[1];
		$next['description'] = $row[2];
		$ret[] = $next;
	}
	$ret = json_encode($ret);
	exit("{\"status\":0, \"message\":\"Got maps successfully\", \"data\":$ret}");
}

//Returns the credentials stored in the session variables
function getUserCredentials()
{
	global $uid, $username, $pass, $utype;
	$cred = "{
		\"id\":$uid,
		\"username\":\"$username\",
		\"password\":\"$pass\",
		\"type\":$utype
		}";
	exit("{\"status\":0, \"message\":\"Got credentials successfully\", \"data\":$cred}");
}

//Takes the name of the map to publish
function publishMap()
{
	global $sql, $username;
	
	if(!isset($_POST['title']))
		exit('{"status": -2, "message": "Missing arguments"}');
	$title = $_POST['title'];
	
	$sql->query("UPDATE maps SET published=1 WHERE name='$title' AND owner='$username'");
	exit("{\"status\":0, \"message\":\"Updated maps to published successfully\"}");
}

//De-publishes a map
//Takes the name of the map to hide
function hideMap()
{
	global $sql, $username;
	
	if(!isset($_POST['title']))
		exit('{"status": -2, "message": "Missing arguments"}');
	$title = $_POST['title'];
	
	$sql->query("UPDATE maps SET published=0 WHERE name='$title' AND owner='$username'");
	exit("{\"status\":0, \"message\":\"Updated maps to unPublished successfully\"}");
}

function getPlayableMap()
{
	global $sql, $username, $utype;
	
	if(!isset($_POST['mapId']))
		exit('{"status": -2, "message": "Missing arguments"}');
	
	$mapId = $_POST['mapId'];
	$result = $sql->query("SELECT mapjson FROM maps WHERE id='$mapId' ");
	$resultArray = $result->fetch_row();
	if(isset($resultArray[0]))
	{
		$mapdata = $resultArray[0];
		exit("{\"status\":0, \"data\": $mapdata, \"message\": \"Map loaded successfully\"}");
	}
	else
		exit("{\"status\": -8, \"message\": \"Map '$mapId' does not exist \"}");
}

function getPublishedMaps()
{
	global $sql, $username;
	$result = $sql->query("SELECT id,name,description FROM maps WHERE published=1 AND owner='$username'");
	$numrows = $result->num_rows;
	$ret = [];
	for($i=0; $i<$numrows; $i++)
	{
		$row = $result->fetch_row();
		$next = array();
		$next['id'] = $row[0];
		$next['name'] = $row[1];
		$next['description'] = $row[2];
		$ret[] = $next;
	}
	$ret = json_encode($ret);
	exit("{\"status\":0, \"message\":\"Got published maps successfully\", \"data\":$ret}");
}

function getUnpublishedMaps()
{
	global $sql, $username;
	$result = $sql->query("SELECT id,name,description FROM maps WHERE published=0 AND owner='$username'");
	$numrows = $result->num_rows;
	$ret = [];
	for($i=0; $i<$numrows; $i++)
	{
		$row = $result->fetch_row();
		$next = array();
		$next['id'] = $row[0];
		$next['name'] = $row[1];
		$next['description'] = $row[2];
		$ret[] = $next;
	}
	$ret = json_encode($ret);
	exit("{\"status\":0, \"message\":\"Got unpublished maps successfully\", \"data\":$ret}");
	
}

?>

