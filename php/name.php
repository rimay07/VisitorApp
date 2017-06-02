<?php
	require_once 'functions.php';
	$array = json_decode($_POST['visitorDetails']);
	$content = $array;//explode("\n", file_get_contents($textFile,0,null,null));
	function __autoload($class) {
	   require $class . '.php';
	}
	$functions = new Functions;
	$retVal = $functions->processVisitor($content);
	echo $retVal->data;
?>