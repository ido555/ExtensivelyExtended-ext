import Weather from "./Classes/Weather.js";
import Location from "./Classes/Location.js";

const searchUrl = 'https://www.bing.com/search?q='
// TODO refresh api key when migrating to DigitalOcean and hide it as an environment variable
const openWeatherApiKey = "6a4aa6a00724ca8345a3876a3a2e81ef"
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/"
const randomImageApi = "https://extensivelyextended.com/.netlify/functions/random_image"

const currentWeatherEndpoint = "weather"
const assetsPath = "./Assets/"
const sunnyPath = assetsPath + "sunny.png"
const cloudyPath = assetsPath + "cloudy.png"
const snowflakePath = assetsPath + "snowflake.png"

setFallbackBackground()
randomBackground()
initWeatherWidget()

function setFallbackBackground() {
    document.querySelector("#backgroundImage").style.background = "#303030"
}

async function getRandomImage() {
    return fetch(randomImageApi).then((r)=>{
        return r;
    }).catch((e)=>{
        throw Error()
    })
}
async function randomBackground(){
    try{
        let r = await getRandomImage();
        if (r.status != 200){
            document.querySelector("#backgroundImage").style.backgroundImage = "url(https://images.unsplash.com/photo-1650923124319-d634f0223ad8?fm=jpg&q=85)"
        }
        r = await r.json()
        console.log(r)
        document.querySelector("#backgroundImage").style.backgroundImage = "url(" + r.images.urls.regular + ")"
        document.querySelector("#imageCreatorName").textContent = r.images.user.name
        document.querySelector("#imageCreatorName").href = r.images.user.links.html + "?utm_source=ExtensivelyExtended&utm_medium=referral"
        document.getElementById("photoCredit").classList.remove("hidden");
    }catch (e) {
        setFallbackBackground()
    }

}

function handleSearch() {
    let userQuery = document.getElementById('userQuery').value;
    // check if user query is empty or contains just whitespace
    if (userQuery.trim() == "") {
        document.getElementById('userQuery').classList.add("errorOutline")
        return
    }
    location.assign(searchUrl + userQuery);
}

async function getGeolocation() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function getWeather() {
    let location = await getGeolocation().then(position => {
        return new Location(position.coords.latitude, position.coords.longitude);
    }).catch(e => {
        return null;
    });
    if (location == null) {
        return null
    }

    // TODO perform this api call in the DigitalOcean backend when migrating to hide the api key
    let openWeatherCurrentWeather = `${weatherApiUrl}${currentWeatherEndpoint}?lat=${location.latitude}&lon=${location.longitude}&appid=${openWeatherApiKey}&units=metric`
    return fetch(openWeatherCurrentWeather)
        .then((response) => {
            if (!response.ok) {
                throw Error(`${response.url}\n${response.status}\n${response.statusText}\n`)
            }
            return response.json()
        })
        .then((data) => {
            return new Weather(data.name, data.main['temp'], data.main['humidity']);
        }).catch((e) => {
            return null
        })
}

async function initWeatherWidget() {
    let weather = await getWeather()
    if (weather == null){
        return
    }

    document.getElementById("weatherWidgetCityName").textContent=`${weather.cityName}`;
    document.getElementById("weatherWidgetTemperature").textContent=`${weather.temperature}`;
    document.getElementById("weatherWidgetHumidity").textContent=`Humidity: ${weather.humidity}%`;

    let weatherImagePath = ""
    if (weather.temperature >= 24){
        weatherImagePath = sunnyPath;
    }else if (weather.temperature >= 17){
        weatherImagePath = cloudyPath;
    }else {
        weatherImagePath = snowflakePath;
    }
    document.getElementById("weatherWidgetTemperatureImage").src=weatherImagePath;

    document.getElementById("weatherWidget").classList.remove("hidden");

}

document.querySelector("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault()
    handleSearch()
});
document.querySelector("#searchButton").addEventListener("click", (e) => {
    e.preventDefault()
    handleSearch()
});
document.querySelector("#refreshBackground").addEventListener("click", (e) => {
    randomBackground()
});