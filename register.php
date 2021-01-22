<?php

header('Access-Control-Allow-Origin: *');

include "settings.php";
include "lib/mail/phpmailer.class.php";
include "lib/email.class.php";


$data = $_POST;
$data["IPAddress"] = $_SERVER["REMOTE_ADDR"];
$data["SourceIP"] = $_SERVER['SERVER_ADDR'] ? $_SERVER['SERVER_ADDR'] : $_SERVER['LOCAL_ADDR'];
$serialize = array();
foreach ($data as $key=>$val) {
                if ($key == "o" || $key == "n") continue;
                if (!is_array($val)) $serialize[] = $key . "=". urlencode($val);
                else {
                                foreach ($val as $key2=>$val2) {
                                                $serialize[] = $key . "[]=". urlencode($val2);
                                }
                }
}

$url = "http://crm.joeyai.email/do/register.php";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST      ,1);
curl_setopt($ch, CURLOPT_POSTFIELDS, implode("&", $serialize));
curl_setopt($ch, CURLOPT_FOLLOWLOCATION  ,1);
curl_setopt($ch, CURLOPT_HEADER      ,0);  // DO NOT RETURN HTTP HEADERS
curl_setopt($ch, CURLOPT_RETURNTRANSFER  ,1);  // RETURN THE CONTENTS OF THE CALL
 
$ret = curl_exec($ch);
$email  = new CEmail($_POST);
$subject = "Welcome to Joshua Creek Montage";
$template = "edm";
//$_POST["Email"] =  "lgrecu@joeyai.com";
$email->sendRich($_POST["Email"], $subject, $template);
die($ret);

?>