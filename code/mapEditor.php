<?php
	session_start();
	
	if(isset($_SESSION['LAST_ACTIVITY']) && time() - $_SESSION['LAST_ACTIVITY'] > 1200)
		header("Location: /group3/code/index.php?logout=true");
		//header("Location: http://129.123.224.49/index.php?logout=true");
	$_SESSION['LAST_ACTIVITY'] = time();
	
	if(!isset($_SESSION['usertype']) || $_SESSION['usertype'] < 2)
		header('Location: /group3/code/index.php');
		//header('Location: http://129.123.224.49/index.php');
	if(isset($_SESSION['username']))
	{
		$username = $_SESSION['username'];
		setcookie("user", $username, time()+1200);
	}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Map Editor</title>


<link type="text/css" rel="stylesheet" href="css/themedbootstrap.css"  />
<link rel="stylesheet" href="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.0/themes/le-frog/jquery-ui.css" />
<link type="text/css" rel="stylesheet" href="css/mapEditor.css"  />
<link type="text/css" rel="stylesheet" href="css/chat.css" />

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
  </div>
  
<h1 class= "h1MapCanvas" id="canvasName">MAP EDITOR</h1>

	<div class="container">
		<div class="col-lg-5">
			<div class="container">
				
				<div class="layer">
					<a href="#" class = "layerSelected" id="bottomTiles">Bottom</a>
					<a href="#" class = "layerUnselected"  id="middleTiles">Middle</a>
					<a href="#" class = "layerUnselected" id="topTiles" >Top</a>
					<a href="#" class = "layerUnselected"  id="eventTiles" >Event</a>
				</div>

				<div class="tC">
					<canvas class= "tiles" id="tilesCanvas" width="320" height="240">

						<!-- Insert fallback content here// bottom||width="320" height="240" //
								middle||width="320" height="360" top||width="320" height="40"
								event||//width="200" height="40" 		 -->
					</canvas>
					<canvas class= "tilesUpper" id="upperTilesCanvas" width="350" height="275">
					</canvas>
					<div class ="toolsRight">
					<a href="#" class = "toolSelected"  id="brush">Brush</a>
					<a href="#" class = "toolUnselected"  id="selector">Select</a>
					<a href="#" class = "toolUnselected"  id="eraser" >Eraser</a>
					<!--
					<ul class="nav nav-tabs green">
						<li class="dropdown ">
						<a class="dropdown-toggle" data-toggle="dropdown" href="#">Size<b class="caret" id="caret2"></b></a>
							<ul class="dropdown-menu">
								<li id="small"><a href = "#" >Small</a></li>
								<li id="medium"><a href = "#" >Med</a></li>
								<li id="large"><a href = "#" >Large</a></li>
							</ul>
						</li>
					</ul>	
				-->
					</div>

				</div>
						
			</div>
		</div>
	
		<div class="col-lg-7">
			<div class="container">
				<ul class="nav nav-tabs red">
					<li class="dropdown ">
					<a class="dropdown-toggle" data-toggle="dropdown" href="#">File<b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li id="newMap"><a href = "#" >New</a></li>
							<li id="openMap"><a href = "#" >Open</a></li>
							<li id="saveMap"><a href = "#" >Save</a></li>
							<li id="saveAsMap"><a href = "#" >Save as</a></li>
							<li id="genRandom"><a href = "#" >Random Map</a></li>
						</ul>

					</li>

					<li class="dropdown ">
						<a class="dropdown-toggle" data-toggle="dropdown" href="#">Edit<b class="caret"></b></a>	
						<ul class="dropdown-menu">
							<li id="copyMap"><a href = "#" >Copy</a></li>	
							<li id="pasteMap"><a href = "#" >Paste</a></li>
							<li id="undoMap"><a href = "#" >Undo</a></li>			
							<li id="redoMap"><a href = "#" >Redo</a></li>
						</ul>
					</li>				
					<li class="dropdown ">
						<a class="dropdown-toggle" data-toggle="dropdown" href="#">Grid<b class="caret"></b></a>	
						<ul class="dropdown-menu">
							<li id="gridOn"><a href = "#" >On</a></li>
							<li id="gridOff"><a href = "#" >Off</a></li>
						</ul>
					</li>
					<li class="dropdown ">
						<a class="dropdown-toggle" data-toggle="dropdown" href="#">Publish<b class="caret"></b></a>	
						<ul class="dropdown-menu">
							<li id="publish"><a href = "#" >Publish</a></li>
							<li id="unpublish"><a href = "#" >Unpublish</a></li>
						</ul>
					</li>
					<li class="dropdown ">
						<a class="dropdown-toggle" data-toggle="dropdown" href="#">Help<b class="caret"></b></a>	
						<ul class="dropdown-menu">
							<li id="hotKeys"><a href = "#" >Hot Keys</a></li>
						</ul>
					</li>
					<div class = "displayLevel" >Bottom</div>							
				</ul>
				
				<div  class= "dialog-newMap" id="dialog-form" title="Create New Map">
					  <form class="d-forms">
					  <fieldset>
					    <label for="newMapName" >Map Name</label>
					    <input type="text" name="newMapName" id="newMapName" class="text ui-widget-content ui-corner-all ui-state-error"/>
 					 </fieldset>
 					 <p class="mapsTitle">Existing Maps</p>
 					 </form>
 					 <p class="errors"></p>
 					 
 					 <div class="ownedMaps"></div>
					</div>
			
					<div class= "dialog-openMap" id="dialog-form" title="Open Map">
					  <form class="d-forms">
					  <fieldset>
					    <label for="openMapName">Map Name</label>
					    <input type="text" name="openMapName" id="openMapName"  class="text ui-widget-content ui-corner-all ui-state-error"/>
 					 </fieldset>
 					 <p class="mapsTitle">Existing Maps</p>
 					 </form>
 					 <p class="errors"></p>
 					 
 					 <div class="ownedMaps"></div>
					</div>

					<div  class="dialog-saveAsMap" id="dialog-form" title="Save As">
					  <form class="d-forms">
					  <fieldset>
					    <label for="saveAsMapName">Map Name</label>
					    <input type="text" name="saveAsMapName" id="saveAsMapName"  class="text ui-widget-content ui-corner-all ui-state-error"/>
 					 </fieldset>
 					  <p class="mapsTitle">Existing Maps</p>
 					 </form>
 			
 					 <p class="errors"></p>
 					
 					 <div class="ownedMaps"></div>
					</div>

					<div  class="dialog-randomMap" id="dialog-form" title="Random Map">
					  <form class="d-forms">
					  <fieldset>
					    <label for="randomMapName">Map Name</label>
					    <input type="text" name="randomMapName" id="randomMapName"  class="text ui-widget-content ui-corner-all ui-state-error"/>
 					 </fieldset>
 					  <p class="mapsTitle">Existing Maps</p>
 					 </form>
 			
 					 <p class="errors"></p>
 					
 					 <div class="ownedMaps"></div>
					</div>

					<div  class="dialog-publish" id="dialog-form" title="Publish Maps">
					  <form class="d-forms">
					  	<p class="mapsTitle">Unpublished Maps</p>
 					  
 					 </form>
 				
 					 <div class="unpublishMaps"></div>
					</div>

					<div  class="dialog-unpublish" id="dialog-form" title="Unpublish Maps">
					  <form class="d-forms">
					  	<p class="mapsTitle">Published Maps</p>
 					  
 					 </form>
 					 <div class="publishMaps"></div>
					</div>

					<div  class="dialog-hotKeys" id="dialog-form" title="Hot Keys">
					  <form class="d-forms">
 					 
 					  <div class="hotK">Copy - c</div>
 					  <div class="hotK">Paste - p</div>
 					  <div class="hotK">Undo - u</div>
 					  <div class="hotK">Redo - r</div>
 					  <div class="hotK">Brush - b</div>
 					  <div class="hotK">Select - s</div>
 					  <div class="hotK">Eraser - e</div>
 					 </form>
					</div>
					
					<div  class="dialog-treasure" id="dialog-form" title="Treasure Box">
					  <form class="d-forms">
					  	
					  <fieldset>
 						<label for="tBoxItem">Item</label>
					    <input type="text" name="tBoxItem" id="tBoxItem"  class="text ui-widget-content ui-corner-all ui-state-error"/>
 					 </fieldset>
 					 
 					<p class="mapsTitle">Items</p>
 					<div class="gameItems">
 					 	<div class = "clickedMapName" id="Shotgun" >Shotgun</div>
 					 	<div class = "clickedMapName" id="Knife" >Knife</div>
 					 	<div class = "clickedMapName" id="Machine Gun" >Machine Gun</div>
 					</div>
 					</form>
 					 <p class="errors"></p>
					</div>

					<div  class="dialog-hole" id="dialog-form" title="Hole Event">
					  <form class="d-forms">
					  	
					  <fieldset>
					  	

					  	<label for="hDid">Send To Map</label>
					    <input type="text" name="hDid" id="hDid"  class="text ui-widget-content ui-corner-all ui-state-error"/>
 						<label for="hDxLoc">Send To X Loc</label>
					    <input type="text" name="hDxLoc" id="hDxLoc"  class="text ui-widget-content ui-corner-all ui-state-error"/>

 					    <label for="hDyLoc">Send To Y Loc</label>
					    <input type="text" name="hDyLoc" id="hDyLoc"  class="text ui-widget-content ui-corner-all ui-state-error"/>
 					 	
 					 </fieldset>
 					 <p class="mapsTitle">Existing Maps</p>
 					 </form>
 					<p class="errors"></p>
 					
 					 <div class="ownedMaps"></div>
 					 
					</div>

					<div  class="dialog-door" id="dialog-form" title="Door Event">
					  <form class="d-forms">
					  	
					  <fieldset>
					  	<label for="dDid">Send To Map</label>
					    <input type="text" name="dDid" id="dDid"  class="text ui-widget-content ui-corner-all ui-state-error"/>
 						<label for="dDxLoc">Send To X Loc</label>
					    <input type="text" name="dDxLoc" id="dDxLoc"  class="text ui-widget-content ui-corner-all ui-state-error"/>

 					    <label for="dDyLoc">Send To Y loc</label>
					    <input type="text" name="dDyLoc" id="dDyLoc"  class="text ui-widget-content ui-corner-all ui-state-error"/>
 					 	
 					 </fieldset>
 					 <p class="mapsTitle">Existing Maps</p>
 					 </form>
 					<p class="errors"></p>
 					
 					 <div class="ownedMaps"></div>
 					 
					</div>						
				<div class="mC">
					<canvas class="map" id="mapCanvas" width="600" height="600">
                        <!-- Insert fallback content here -->
					</canvas>
				</div>
					
			</div>	
		</div>
	</div>

	<hr>
<center>
<img  class="logo2" src="img/Logo.png" alt="Zombie Logo" />
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
		
		<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
		<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
		<script src="js/bootstrap.js"></script>
		<script src="js/variables.js"></script>
		<script src="js/dialogBoxes.js"></script>
		<script src="js/canvas.js"></script>
		<!--<script src="js/Chat.js"></script>-->
		
	</body>
	
</html>
