<?php
if( !isset( $_SERVER['HTTP_X_REQUESTED_WITH'] ) || !( $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest' ) )
    exit();

if(file_exists('config.php'))
	include 'config.php';

if(!isset($api_key))
	$api_key = 'please set an API key';

if(!isset($_GET["searchByWhat"]) || !isset($_GET["searchByWhat"]))
	exit();

$bywhat = $_GET["searchByWhat"];
$url = '';

switch($bywhat){
	case 'by-issn':
		$issn = $_GET["searchValue"];
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=exact&ak=".$api_key."&issn=".$issn;
	break;
	case 'by-id':
		$id = $_GET["searchValue"];
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&ak=".$api_key."&id=".$id;
	break;
	case 'by-journal':
		$journal_name = $_GET["searchValue"];
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=contains&ak=".$api_key."&jtitle=".$journal_name;
	break;
	case 'by-publisher':
		$publisher_name = $_GET["searchValue"];
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=exact&ak=".$api_key."&pub=".$publisher_name;
	break;
	default:
		exit();
}

$xml = file_get_contents($url);
echo ($xml);

?>