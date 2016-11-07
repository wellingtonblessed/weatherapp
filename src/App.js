import React, { Component } from 'react';
import logo from './img/logo.svg';
import loader from './img/loader.gif';
import refresh from './img/refresh.png';
import partlycloudy from './img/icons/partlycloudy.png';
import sunset from './img/icons/sunset.png';
import sunrise from './img/icons/sunrise.png';
import humidity from './img/icons/humidity.png';
import pressure from './img/icons/pressure.png';
import clear from './img/icons/01d.png';
import clearNight from './img/icons/01n.png';
import fewClouds from './img/icons/02d.png';
import fewCloudsNight from './img/icons/02n.png';
import scatteredClouds from './img/icons/03d.png';
import brokenClouds from './img/icons/04d.png';
import showerRain from './img/icons/09d.png';
import rain from './img/icons/10d.png';
import rainNight from './img/icons/10n.png';
import thunderstorm from './img/icons/11d.png';
import snow from './img/icons/13d.png';
import mist from './img/icons/50d.png';
import './css/App.css';
import './css/Bootstrap.css';
var REQUEST_URL = 'http://api.openweathermap.org/data/2.5/weather?units=metric&';
var API_KEY = '164b3644398bcd6e2b2022f1b096134d';
class App extends Component {
  constructor(){
        super();
        this.state = {
            loaded: false,
            network: true,
            locationSupport: true,
            lat: 35,
            lon: 139
        };
    };
    
    componentDidMount() {
        //get user location and fetch data from api
		this.getTheLocation();
    };
	
	getTheLocation(){
		//chech if browser allows geolocation
		if(!!navigator.geolocation) {
			let self = this;
			navigator.geolocation.watchPosition(function(position) {
				self.setState({'lat':position.coords.latitude});
				self.setState({'lon':position.coords.longitude});
				self.fetchData(self.state.lat, self.state.lon);
			},
		  //if an error occurs, change state to show error screen
		  (error) => this.setState({loaded:false, network:false}),
		  {enableHighAccuracy: true, timeout: 50000, maximumAge: 1000}
	  );
		this.setState({locationSupport:true});
		} else {
			//if the browser does not support geolocation, change state to show error screen
			this.setState({loaded:false});
			this.setState({locationSupport:false});
		}
	};
	//function to get data from the openweathermap api
	fetchData(lat, lon){
		let self = this;		
		var fullUrl = REQUEST_URL + 'lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY; //construct the url
		fetch(fullUrl)
		  .then((response) => response.json())
		  .then((responseData) => {			
				//here I take the json data and assign it to states (variables)
				self.setState({
				  city: responseData.name,
				  outlook: responseData.weather[0].main,
				  outlook_description: responseData.weather[0].description,
				  outlook_icon: responseData.weather[0].icon,
				  temp: responseData.main.temp,
				  temp_min: responseData.main.temp_min,
				  temp_max: responseData.main.temp_max,
				  pressure: responseData.main.pressure,
				  humidity: responseData.main.humidity,
				  sunrise: responseData.sys.sunrise,
				  sunset: responseData.sys.sunset,
				  loaded: true,
				});
				
		  })
		  .catch( (error) => console.log(error) )
		  .done();
		
	  };
	  
	 //function to convert the unix time stamp given on sunrise and sunset times into 24h readable time
	 unix_to_time(unix_time) {
			var d = new Date(unix_time*1000);
			var n = ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2); //splice makes here is making numbers less than 10 start with a 0
			return n;
		};
	  
	  //function to get the current time and make it readable
	  theTime(){
		var today = new Date();
		var day = today.getDay();
		var daylist = ["Sun","Mon","Tue","Wed ","Thu","Fri","Sat"];
				var hour = today.getHours();
				var minute = ('0' + today.getMinutes()).slice(-2);
				var second = today.getSeconds();
				var prepand = (hour >= 12)? " PM ":" AM ";
				hour = (hour >= 12)? hour - 12: hour;

		if (hour===0 && prepand===' PM ') {    
			if (minute===0 && second===0){  
				hour=12;
				prepand=' Noon';
			}else{  
				hour=12;
				prepand=' PM';
			}  
		}  

		if (hour===0 && prepand===' AM '){    
			if (minute===0 && second===0){  
				hour=12;
				prepand=' Midnight';
			}else{  
				hour=12;
				prepand=' AM';
			}  
		}  
		  
		return (daylist[day] + " @ " + hour + " : " + minute + prepand);
		
		};
	  
	  //this view shows before the app loads and gets data
	  renderLoadingView() {
		return (
			<div className="container-fluid App loader">
				<img src={clear} className="App-logo" alt="loader" />
			</div>
		);
	  };
	  
	  //this view shows if there is a network error
      renderErrorView() {
		return (
			<div className="container-fluid App loader">
				<div className="col-sm-4 col-sm-offset-4">
					<div className="errorBox">
						<p className="error">Oops! Location Restricted</p>
						<a href="" className="btn btn-lg btn-primary">Try again</a>
					</div>
				</div>
			</div>
		);
	  };
	
	//this view shows in the case of an error in getting user location
	renderGPSErrorView() {
		return (
			<div className="container-fluid App loader">
				<div className="col-sm-4 col-sm-offset-4">
					<div className="errorBox">
						<p className="error">Oops! No GPS Support</p>
						<a href="" className="btn btn-lg btn-primary">Try again</a>
					</div>
				</div>
			</div>
		);
	  };
  
	render() {
		//if statements to assess whether there is an error and show the relevant view
		if (!this.state.loaded) {
			if(!this.state.network){
				return this.renderErrorView();
			}else if(!this.state.locationSupport){
				return this.renderGPSErrorView();
			}else{
				return this.renderLoadingView();
			}
		}
		//Convert the weather outlook to camelCase 
		var outlook = this.state.outlook_description;
		outlook = outlook.toLowerCase().replace(/\b[a-z]/g, function(letter) {
				return letter.toUpperCase();
			});
		
		//Replace the openweathermap icons with custon icons
		var weatherIcon;
		if(this.state.outlook_icon === '01d'){
			weatherIcon = clear;
		}else if(this.state.outlook_icon === '01n'){
			weatherIcon = clearNight;
		}else if(this.state.outlook_icon === '02d'){
			weatherIcon = fewClouds;
		}else if(this.state.outlook_icon === '02n'){
			weatherIcon = fewCloudsNight;
		}else if(this.state.outlook_icon === '10d'){
			weatherIcon = rain;
		}else if(this.state.outlook_icon === '10n'){
			weatherIcon = rainNight;
		}else if(this.state.outlook_icon === '03d' || this.state.outlook_icon === '03n'){
			weatherIcon = scatteredClouds;
		}else if(this.state.outlook_icon === '04d' || this.state.outlook_icon === '04n'){
			weatherIcon = brokenClouds;
		}else if(this.state.outlook_icon === '09d' || this.state.outlook_icon === '09n'){
			weatherIcon = showerRain;
		}else if(this.state.outlook_icon === '11d' || this.state.outlook_icon === '11n'){
			weatherIcon = thunderstorm;
		}else if(this.state.outlook_icon === '13d' || this.state.outlook_icon === '13n'){
			weatherIcon = snow;
		}else if(this.state.outlook_icon === '50d' || this.state.outlook_icon === '50n'){
			weatherIcon = mist;
		}
		//the magic happens in here
		return (
		  <div className="container-fluid App">
			<div className="row">
				<div className="col-md-2 col-xs-6 city">
					<p>{this.state.city}</p>
				</div>
				<div className="col-md-3 col-xs-6 city">
					<p>{this.theTime()}</p>
				</div>
				<div className="col-md-7 city hidden-xs">
					<a href=""><img src={refresh} className="refresh"/></a>
				</div>
			</div>
			<div className="row">
				<div className="col-md-3 col-md-offset-2 hidden-xs hidden-sm">
					<p><img src={weatherIcon} className="img-responsive" alt="logo" /></p>
						<p className="temp">{this.state.temp}°C</p>
						<p className="outlook">{outlook}</p>
						<p className="temps">↑{this.state.temp_min}° | {this.state.temp_max}°↓</p>
				</div>
				<div className="col-md-12 visible-xs visible-sm head">
					<div className="col-xs-6 bottom-pad">
						<p><img src={weatherIcon} className="img-responsive" alt="logo" /></p>
					</div>
					<div className="col-xs-6 bottom-pad">
						<p className="temp">{this.state.temp}°C</p>
						<p className="outlook">{outlook}</p>
						<p className="temps">↑{this.state.temp_min}° | {this.state.temp_max}°↓</p>
					</div>
				</div>
				<div className="col-md-4 col-sm-12 col-md-offset-1">
					<div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td><img src={humidity} className="table-icons" alt="logo" /></td>
                                            <td>Humidity</td>
                                            <td>{this.state.humidity}%</td>
                                        </tr>
                                        <tr>
                                            <td><img src={pressure} className="table-icons" alt="logo" /></td>
                                            <td>Pressure</td>
                                            <td>{this.state.pressure} ↓</td>
                                        </tr>
                                        <tr>
                                            <td><img src={sunrise} className="table-icons" alt="logo" /></td>
                                            <td>Sunrise</td>
                                            <td>{this.unix_to_time(this.state.sunrise)}</td>
                                        </tr>
                                        <tr>
                                            <td><img src={sunset} className="table-icons" alt="logo" /></td>
                                            <td>Sunset</td>
                                            <td>{this.unix_to_time(this.state.sunset)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
				</div>
				
				<div className="col-md-12 city visible-xs ref-button">
					<a href="" className="btn btn-md btn-primary">Refresh</a>
				</div>
			</div>
		  </div>
		);
	}
}

export default App;
