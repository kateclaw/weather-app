(function() { // IIFE

// API KEY SETUP
var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
var DARKSKY_API_KEY = '379d19487e333cf3daa616812315500f';
var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

var GOOGLE_MAPS_API_KEY = 'AIzaSyCVkKVnAdskF8rxpQrrfQelVYdfdzGVmmU';
var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

//Function: get lat/lng of given city
function getCoordinatesForCity(cityName) {

    // ES6 template string
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
        fetch(url) // Returns a promise for a Response
        .then(response => response.json()) // Returns a promise for the parsed JSON
        .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
    )
}

//Function: returns a promise that will resolve with the address of the city
function getCityAddress(cityName) {

    // ES6 template string
     var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
        fetch(url) // Returns a promise for a Response
        .then(response => response.json()) // Returns a promise for the parsed JSON
        .then(data => data.results[0].formatted_address) // Transform the response to only take what we need
    )
}

// Function: gets current weather of given city
function getCurrentWeather(coords) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=us&exclude=minutely,hourly,daily,alerts,flags`;
  
    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data.currently)
    );
}

// Function: gets daily weather of given city
function getFiveDay(coords) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=us&exclude=currently,minutely,hourly,alerts,flags`;
  
    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data.daily)
    );
}

//Function: gets skycons, assigns to according weather
function setWeatherIcon(panel, weather)
{
    var skycons = new Skycons({"color": "#3b3a36"});

        switch(weather) {
            case "rain":
                skycons.add(panel, Skycons.RAIN);
                break;
            case "snow":
                skycons.add(panel, Skycons.SNOW);
                break;
            case "sleet":
                skycons.add(panel, Skycons.SLEET);
                break;
            case "wind":
                skycons.add(panel, Skycons.WIND);
                break;
            case "fog":
                skycons.add(panel, Skycons.FOG);
                break;
            case "cloudy":
                skycons.add(panel, Skycons.CLOUDY);
                break;
            case "partly-cloudy-day":
                skycons.add(panel, Skycons.PARTLY_CLOUDY_DAY);
                break;
            case "partly-cloudy-night":
                skycons.add(panel, Skycons.PARTLY_CLOUDY_NIGHT);
                break;
            default:
                skycons.add(panel, Skycons.CLEAR_DAY);
        }

    
        skycons.play();
}

// assigning variables
var app = document.querySelector('#app');
var cityForm = app.querySelector('.city-form');
var cityInput = cityForm.querySelector('.city-input');
var cityWeather = app.querySelector('.city-weather');
var cityName = app.querySelector('.city-name');
var fiveDay = app.querySelector('.get-fiveday-button');
// var holder = app.querySelector('.holder');

//autocomplete
var autocomplete = new google.maps.places.Autocomplete(cityInput);


// when "get weather" clicked
cityForm.addEventListener('submit', function(event){
    event.preventDefault(); // prevents form from submitting

    var city = cityInput.value; // grabs the current value of the input

    // "loading" gif
    $('<p class="loader" style="text-align:center;">loading...</p>').insertAfter('.city-form'); // appends gif to "app" div

    // hide city weather and icon
    $('.city-weather').hide();
    $('.weather-icon').hide();
    $('.city-name').hide();
    $('.get-fiveday-button').hide();
    $('.container').hide();
    $('#fiveday-title').hide();



    // current weather
    getCoordinatesForCity(city) // gets cordiantes for input city
    .then(getCurrentWeather) // gets weather for coordinates
    .then(function(weather) {
        $('.loader').remove(); // removes loader once ajax has completed

        // shows weather and icon
        $('.city-weather').show(); 
        $('.weather-icon').show();
        $('.city-name').show();
        $('.get-fiveday-button').show();
        // $('.container').show();
        // $('#fiveday-title').show();


        //display city name
		getCityAddress(city)
		.then(function(displayCity) {
			cityName.innerText = displayCity;
        });

        // set icon
        setWeatherIcon("icon", weather.icon);
        
        // temp
        cityWeather.innerHTML = '<div id="temp">' + `<h2 id="temp-num"> ${weather.temperature} \xB0F</h2>` + '</div>'
        // wind speed
        + '<div id="wind">' + '<h4 id="wind-text">Wind speed: </h4>' + `<h4 id="wind-num"> ${weather.windSpeed} </h4>` + '</div>'
        // humidity
        + '<div id="humidity">' + '<h4 id="humidity-text">Humidity: </h4>' + `<h4 id="humidity-num"> ${weather.humidity} </h4>` + '</div>'
        // UV index
        + '<div id="UV">' + '<h4 id="UV-text">UV index: </h4>' + `<h4 id="UV-num"> ${weather.uvIndex} </h4>` + '</div>'
        // summary
        + '<div id="summary">' + '<h4 id="summary-text">Weather summary: </h4>' + `<h4 id="summary-num"> ${weather.summary} </h4>` + '</div>';

    });

});


var currentDay = app.querySelector('#day-one');
var title = app.querySelector('#fiveday-title');

//handle five day forecast request
fiveDay.addEventListener('click', function() {

    var city = cityInput.value;
    $('<p class="loader" style="text-align:center;">loading...</p>').insertAfter('.holder'); // appends gif to "app" div
        
    $('.container').hide();
    $('#fiveday-title').hide();

    getCoordinatesForCity(city)
	.then(getFiveDay)
	.then(function(weather) {
        $('.loader').remove(); // removes loader once ajax has completed

        $('.container').show();
        $('#fiveday-title').show();

		title.innerText = 'FIVE DAY FORECAST \n';

		var daysIcon = "icon1";
		var daysInfo = app.querySelector('#day-one-weather');

		for(var i = 0; i < 5; i++) {
			switch (i) {
				case 0:
					break;
				case 1:
					currentDay = app.querySelector('#day-two');
					daysIcon = "icon2";
					daysInfo = app.querySelector('#day-two-weather');
					break;
				case 2:
					currentDay = app.querySelector('#day-three');
					daysIcon = "icon3";
					daysInfo = app.querySelector('#day-three-weather');
					break;
				case 3:
					currentDay = app.querySelector('#day-four');
					daysIcon = "icon4";
					daysInfo = app.querySelector('#day-four-weather');
					break;
				case 4:
					currentDay = app.querySelector('#day-five');
					daysIcon = "icon5";
					daysInfo = app.querySelector('#day-five-weather');
					break;
				default:
					title.innerText = 'ERROR';
			}

			daysInfo.innerHTML = `<p class="text" style="font-size: .8em">High: ${weather.data[i].temperatureMax} \xB0F</p>`
								+ `<p class="text" style="font-size: .8em">Low: ${weather.data[i].temperatureMin} \xB0F</p>`
								+ `<p class="text" style="font-size: .8em">Wind speed: ${weather.data[i].windSpeed}</p>`
                                + `<p class="text" style="font-size: .8em">UV index: ${weather.data[i].uvIndex}</p>`
								+ `<p class="text" style="font-size: .8em; word-wrap: break-word; width:150px;">${weather.data[i].summary}</p>`                              

			//set icon
			setWeatherIcon(daysIcon, weather.data[i].icon);

		}
    });
});


})(); //IIFE