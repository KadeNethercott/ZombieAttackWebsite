<?php
	$page = $_POST['action'];
	$method = "POST";
	if($page == "pull")
		$method = "GET";
	$httpparams = array('http' => array(
		'method' => "POST",
		'header'=> "Content-type: application/x-www-form-urlencoded\r\n",
		'content' => http_build_query($_POST)));
	$context = stream_context_create($httpparams);
	
	if($method == "POST")
		$stream = fopen("http://129.123.224.49:3000/$page", 'r', false, $context);
	else
		$stream = fopen("http://129.123.224.49:3000/$page?" . http_build_query($_POST), 'r', false, $context);
	
	echo stream_get_contents($stream);
	fclose($stream);
?>