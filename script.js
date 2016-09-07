/**
 * Created by Shirley on 5/4/16.
 */
var latitude,longitude;
var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];
var weekday=  ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var today = new Date();
var day = weekday[today.getDay()];
var date = today.getDate()+" "+monthNames[today.getMonth()]+", "+today.getFullYear();

document.querySelector("#conditions h1").innerHTML = day+"<br>"+date;

function getCondition(latitude,longitude) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange= function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);

            var moonPhase = response.daily.data[0].moonPhase;
            var current = response.currently;
            var precipitation = convertPrecipitation(current.precipIntensity, current.precipProbability, current.precipType);
            var temp = Math.round(current.temperature) + '°F / ' + Math.round((current.temperature - 32) * 5 / 9) + '°C';
            var feelTemp = "Feels like " + Math.round(current.apparentTemperature) + '°F / ' + Math.round((current.apparentTemperature - 32) * 5 / 9) + '°C';
            var cloudCover = 'Currently '+Math.round(current.cloudCover) * 100 + '% of sky occluded by clouds';
            var humidity;
            var dewPoint = current.dewPoint;
            if (dewPoint < 50) {
                humidity = (current.humidity * 100).toFixed() + '% ' + "Severely high.";
            } else if (dewPoint < 54) {
                humidity = (current.humidity * 100).toFixed() + '% ' + "Extremely uncomfortable, fairly oppressive";
            } else if (dewPoint < 59) {
                humidity = (current.humidity * 100).toFixed() + '% ' + "Very humid, quite uncomfortable";
            } else if (dewPoint < 64) {
                humidity = (current.humidity * 100).toFixed() + '% ' + "Somewhat uncomfortable for most people at upper edge";
            } else if (dewPoint < 69) {
                humidity = (current.humidity * 100).toFixed() + '% ' + "OK for most, but all perceive the humidity at upper edge";
            } else if (dewPoint < 74) {
                humidity = (current.humidity * 100).toFixed() + '% ' + "Comfortable";
            } else if (dewPoint < 80) {
                humidity = (current.humidity * 100).toFixed() + '% ' + "Very comfortable";
            } else {
                humidity = (current.humidity * 100).toFixed() + '% ' + "A bit dry for some";
            }

            var moonText;
            if (moonPhase == 0) {
                moonText = "New Moon";
            } else if (moonPhase < 0.25) {
                moonText = "Waxing Crescent Moon";
            } else if (moonPhase == 0.25) {
                moonText = "First Quarter Moon";
            } else if (moonPhase < 0.5) {
                moonText = "Waxing Gibbous Moon";
            } else if (moonPhase == 0.5) {
                moonText = "Full Moon";
            } else if (moonPhase < 0.75) {
                moonText = "Waning Gibbous Moon"
            } else if (moonPhase == 0.75) {
                moonText = "Last Quarter Moon";
            } else {
                moonText = "Waning Crescent Moon";
            }
            var visibility = "Visibility: " + current.visibility + " miles";
            var ozone = "Ozone: " + current.ozone + "DU";
            var pressure = "Pressure: " + current.pressure + "mb";

            //write into page
            displayMoon(moonPhase);
            document.querySelector("#conditions h2").innerHTML = 'Today: '+current.summary + "<br>" + cloudCover + "<br><br>"
                + temp + "<br>" + feelTemp + "<br><br>"
                + "Humidity: " + humidity + "<br>" + precipitation + "<br><br>"
                + pressure + "<br>" + ozone + "<br>" + visibility;
            document.getElementById("sun-text").innerHTML = "<p>Sunrise: " + time(response.daily.data[0].sunriseTime * 1000) + "<br>Sunset: " + time(response.daily.data[0].sunsetTime * 1000) + '</p>';
            document.getElementById("moon-text").textContent = moonText;
        }

    };

    var apiRequest = "condition.php?lat=" + latitude + '&lon=' + longitude;
    xhr.open("GET",apiRequest,true);
    xhr.send();

}


function loadGeoLocation() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange= function () {
        if(xhr.readyState==4 && xhr.status==200){
            var response = JSON.parse(xhr.responseText);
            latitude = response.latitude;
            longitude = response.longitude;
            getCondition(latitude,longitude);

        }
    };
    var apiRequest = "https://freegeoip.net/json/";
    xhr.open("GET",apiRequest,true);
    xhr.send();

}


function loadDefaultImage() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange= function () {
        if(xhr.readyState==4 && xhr.status==200){

            var response = JSON.parse(xhr.responseText);
            var title = response.title;
            var copyright = response.copyright;
            var date = response.date;
            var type = response.media_type;
            var explanation = response.explanation;
            var url;
            if(type == "image"){
                if(response.hdurl){
                    url = response.hdurl;
                }else {
                    url = response.url;
                }
                document.querySelector("body").style.backgroundImage = 'url('+url+')';
                //write data to the page
                document.querySelector("#APOD h1").textContent=title;
                if(copyright){
                    document.querySelector("#APOD p").innerHTML=explanation+"<br><br>"+"(Image Credit & Copyright: "+copyright+")";
                }else {
                    document.querySelector("#APOD p").innerHTML=explanation;
                }

            }else if(type == "video"){
                var parts = response.url.split("/");
                var id = parts[parts.length-1].split("?")[0];
                url = "https://img.youtube.com/vi/"+id+"/maxresdefault.jpg";
                document.querySelector("body").style.backgroundImage = 'url('+url+')';
                //write data to the page
                document.querySelector("#APOD h1").textContent=title;
                if(copyright){
                    document.querySelector("#APOD p").innerHTML=explanation+"<br><br>"+"Watch video "+"<a href="+response.url+">HERE</a>"+" ,Copyright: "+copyright+".";
                }else {
                    document.querySelector("#APOD p").innerHTML=explanation+"<br><br>"+"Watch video "+"<a href="+response.url+">HERE</a>"+".";
                }

            }else {
                //write data to the page
                document.querySelector("#APOD h1").textContent=title;
                if(copyright){
                    document.querySelector("#APOD p").textContent=explanation+" (Image Credit & Copyright: "+copyright+")";
                }else {
                    document.querySelector("#APOD p").textContent=explanation;
                }
            }




            
        }
    };
    var apiRequest = "apod.php";
    xhr.open("GET",apiRequest,true);
    xhr.send();

}

loadGeoLocation();
loadDefaultImage();

function displayMoon(moonPhase) {
    console.log(moonPhase);
    if(moonPhase<=0.5){
        position = map_range(moonPhase,0,0.5,25,-25);
        document.getElementById("moon-phase").innerHTML='<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="50px" height="50px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <style type="text/css">.st0{fill:#FFF9E1;}</style><path class="st0"  d="M50,25c0,25-25,25-25,25s'+position+',0,'+position+'-25S25,0,25,0S50,0,50,25z"/></svg> ';
    }else {
        position = map_range(moonPhase,0.5,1,-25,25);
        document.getElementById("moon-phase").innerHTML='<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="50px" height="50px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <style type="text/css">.st0{fill:#FFF9E1; transform: rotate(180deg) ;transform-origin: 50% 50%;}</style><path class="st0"  d="M50,25c0,25-25,25-25,25s'+position+',0,'+position+'-25S25,0,25,0S50,0,50,25z"/></svg> ';
    }

}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function convertPrecipitation(precipIntensity,precipProbability,precipType) {
    var intensity;
    var chance = precipProbability*100;
    if(precipIntensity==0){
        return "No precipitation currently.";
    }else {
        if (precipIntensity < 0.01) {
            intensity = "very light ";
        } else if (precipIntensity < 0.05) {
            intensity = "light ";
        } else if (precipIntensity < 0.3) {
            intensity = "moderate ";
        } else {
            intensity = "heavy ";
        }
        return chance+"% chance of "+intensity+" "+precipType+".";
    }
}

function time(ms) {
    return new Date(ms).toTimeString().split(' ')[0];
}