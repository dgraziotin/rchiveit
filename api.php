<?php

//if( !isset( $_SERVER['HTTP_X_REQUESTED_WITH'] ) || !( $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest' ) )
//exit();

if(file_exists('config.php'))
	include 'config.php';

if(!isset($api_key))
	$api_key = 'please set an API key';

if(!isset($_GET["searchByWhat"]) || !isset($_GET["searchValue"]))
	exit();

$searchByWhat = trim(strtolower($_GET["searchByWhat"]));
$searchValue = trim(strtolower($_GET["searchValue"]));

$url = '';

switch($searchByWhat){
	case 'by-issn':
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=exact&ak=".$api_key."&issn=".$searchValue;
	break;
	case 'by-id':
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&ak=".$api_key."&id=".$searchValue;
	break;
	case 'by-journal':
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=contains&ak=".$api_key."&jtitle=".$searchValue;
	break;
	case 'by-publisher':
		$url = "http://www.sherpa.ac.uk/romeo/api29.php?versions=all&qtype=exact&ak=".$api_key."&pub=".$searchValue;
	break;
	default:
		exit();
}


$hash = md5($url);
$filename = $hash.".xml";

$cacheFile = dirname( __FILE__ ).DIRECTORY_SEPARATOR."cache".DIRECTORY_SEPARATOR.$filename;
$cacheExpiresDays = 7 * (24 * 60 * 60); // Expire Time (7 Days)

if (file_exists($cacheFile) && (time() - filectime($cacheFile)) < $cacheExpiresDays ){
    // cache file exists and is not older than 5 days
    // serve it instead of doing an API call
    $xml = file_get_contents($cacheFile);
}else{
    // cache file does not exist or is older than $cacheExpiresDays
    // make API call and save it.
    $xml =  iconv("ISO-8859-1", "UTF-8", file_get_contents($url));
    if($xml){
        file_put_contents($cacheFile, $xml);
    }else{
        unlink($cacheFile);
    }
}


header("Content-Type: application/xml; charset=utf-8");
echo ($xml);

?>