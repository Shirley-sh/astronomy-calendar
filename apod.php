<?php
// initialize cURL session
$curl = curl_init();
// set URL to load
curl_setopt($curl, CURLOPT_URL, "https://api.nasa.gov/planetary/apod?api_key=ZOZdurgHfGeKk5YfonufJQs2yBOR7Sapcb4YHJ7f&hd=True");
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