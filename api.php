<?php
if(file_exists('config.php'))
	include 'config.php';

if(!isset($api_key))
	$api_key = 'please set an API key';

if (!isset($_GET["issn"]) && isset($_GET["journalname"]) && isset($_GET["what"]) && $_GET["what"] == 'byjournal'){
	$journal_name = $_GET["journalname"];
	$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=contains&ak=".$api_key."&jtitle=".$journal_name;
	$xml = file_get_contents($url);
	echo ($xml);
}else if (!isset($_GET["issn"]) && isset($_GET["journalname"]) && isset($_GET["what"]) && $_GET["what"] == 'bypublisher'){
	$publisher_name = $_GET["journalname"];
	$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=exact&ak=".$api_key."&pub=".$publisher_name;
	$xml = file_get_contents($url);
	echo ($xml);
}else if (!isset($_GET["issn"]) && isset($_GET["journalname"]) && isset($_GET["what"]) && $_GET["what"] == 'byid'){
	$id = $_GET["journalname"];
	$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&ak=".$api_key."&id=".$id;
	$xml = file_get_contents($url);
	echo ($xml);
}else if(isset($_GET["issn"])){
	$journal_issn = $_GET["issn"];
	$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=exact&ak=".$api_key."&issn=".$journal_issn;
	$xml = file_get_contents($url);
	echo ($xml);
}else{
	exit();
}
?>