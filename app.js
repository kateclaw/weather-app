(function() { // IIFE

// API KEY SETUP
var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
var DARKSKY_API_KEY = '379d19487e333cf3daa616812315500f';
var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

var GOOGLE_MAPS_API_KEY = 'AIzaSyCVkKVnAdskF8rxpQrrfQelVYdfdzGVmmU';
var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

//Function: returns a promise that will resolve with an object of lat/lng coordinates
function getCoordinatesForCity(cityName) {

    // ES6 template string
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
        fetch(url) // Returns a promise for a Response
        .then(response => response.json()) // Returns a promise for the parsed JSON
        .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
    )
}

// Function: gets current weather
function getCurrentWeather(coords) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=us&exclude=minutely,hourly,daily,alerts,flags`;
  
    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data.currently)
    );
}

// var geocoder  = new google.maps.Geocoder(); // create a geocoder object
// var location  = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); // turn coordinates into an object          
// geocoder.geocode({'latLng': location}, function (results, status) {
// if(status == google.maps.GeocoderStatus.OK) {  // if geocode success
// var add=results[0].formatted_address; // if address found, pass to processing function
// document.writfe(add);

/*
// Function: gets daily weather
function getDailyWeather(coords) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=us&exclude=currently,minutely,hourly,alerts,flags`;

    return (
        fetch(url)
        .then(response => response.json())
        .then(data => data.daily)
    );

    console.log("got daily weather");
}
*/

// assigning variables
var app = document.querySelector('#app');
var cityForm = app.querySelector('.city-form');
var cityInput = cityForm.querySelector('.city-input');
var cityWeather = app.querySelector('.city-weather');

// var dailyWeather = app.querySelector('.daily-weather');

// when "get weather" clicked
cityForm.addEventListener('submit', function(event){
    event.preventDefault(); // prevents form from submitting

    var city = cityInput.value; // grabs the current value of the input

    // "loading" gif
    $('<p class="loader" style="text-align:center;">loading...</p>').insertAfter('.city-form'); // appends gif to "app" div

    // hide city weather
    $('.city-weather').hide();

    // current weather
    getCoordinatesForCity(city) // gets cordiantes for input city
    .then(getCurrentWeather) // gets weather for coordinates
    .then(function(weather) {
        $('.loader').remove(); // removes loader once ajax has completed
        $('.city-weather').show();
        
        // temp
        cityWeather.innerText = 'Current temperature in ' + city + ': ' + weather.temperature + ' \xB0F'
        // wind speed
        + '\n' + 'Wind speed: ' + weather.windSpeed
        // humidity
        + '\n' + 'Humidity: ' + weather.humidity
        // UV index
        + '\n' + 'UV index: ' + weather.uvIndex
        // summary
        + '\n' + 'Weather summary: ' + weather.summary + '\n' + '\n';
                
    });

});


})(); //IIFE