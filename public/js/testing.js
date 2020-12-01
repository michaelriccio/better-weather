

// Getting the user geolocation.
if('geolocation' in navigator) {
    console.log('geolocation is available');
    navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        console.log(lat);
        console.log(long);
        // Personal API Key for OpenWeatherMap API
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=5f6df12f283bc1a30cd52357ca119ed4`;
        fetch(weatherUrl)
        .then(response => response.json())
        .then(data => console.log(data));

    })    
} else {
    console.log('geolocation is not avaliable');
}
var data = {lat:5, long:10}

fetch('/post', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
}).then(response => response.json())
.then(data => console.log(data));