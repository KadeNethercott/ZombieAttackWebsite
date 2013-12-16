<?php
	$httpparams = array('http' => array(
		'method' => 'POST',
		'header'=> "Content-type: application/x-www-form-urlencoded\r\n",
		'content' => http_build_query($_POST)));
	$context = stream_context_create($httpparams);
	$stream = fopen("http://129.123.224.49/database.php", 'r', false, $context);
	echo stream_get_contents($stream);
	fclose($stream);
?>