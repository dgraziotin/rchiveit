<?php
if(file_exists('config.php'))
	include 'config.php';

if(!isset($api_key))
	$api_key = 'please set an API key';

if(!isset($_GET["what"]) || !isset($_GET["what"]))
	exit();

$what = $_GET["what"];
$url = '';

switch($what){
	case 'byissn':
		$issn = $_GET["journalname"];
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=exact&ak=".$api_key."&issn=".$issn;
	break;
	case 'byid':
		$id = $_GET["journalname"];
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&ak=".$api_key."&id=".$id;
	break;
	case 'byjournal':
		$journal_name = $_GET["journalname"];
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=contains&ak=".$api_key."&jtitle=".$journal_name;
	break;
	case 'bypublisher':
		$publisher_name = $_GET["journalname"];
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=exact&ak=".$api_key."&pub=".$publisher_name;
	break;
	default:
		exit();
}

$xml = file_get_contents($url);
echo ($xml);

?>