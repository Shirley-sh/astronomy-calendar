<?php
// Get variable from JavaScript
$latitude = $_GET['lat'];
$longitude = $_GET['lon'];
// initialize cURL session
$curl = curl_init();

$url = "https://api.forecast.io/forecast/92bf02fc6a88fc430e4524398f5c22d7/".$latitude.",".$longitude;
// set URL to load
curl_setopt($curl, CURLOPT_URL, $url);
// Don't print (yet)
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
// retrieve the URL and assign to variable as a string
$response = curl_exec($curl);
// if an error occurs
if (curl_error($curl)) {
    // print error
    echo 'error';
} else {
    // print URL contents
    echo $response;
}
// close cURL session
curl_close($curl);

?>