<?php
require_once 'functions.php';
if($_FILES['SelectedFile']['size'] > 0)
{
	$fileArr = explode("\n", file_get_contents($_FILES['SelectedFile']['tmp_name'], 0, null, null));
	for($a = 0; $a < count($fileArr); $a++){
		if(stripos($fileArr[$a], " ")){
			$tempArr = explode(" ", $fileArr[$a]);
			$fileArr[$a] = $tempArr;
		}
	}
	function __autoload($class) {
	   require $class . '.php';
	}
	$functions = new Functions;
	$retVal = $functions->processVisitor($fileArr);
	echo $retVal->data;
}
?>