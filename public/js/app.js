// Chart.js
function charting(ctx, data, lab, x) {
    const myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            label: x,
            datasets: [{
                label: lab,
                data: data,
            }]
        },
        options: {}
    });
};

// Global Variables
const key = '5f6df12f283bc1a30cd52357ca119ed4';
const ctxHourlyTemp = document.getElementById('myChartHourlyTemp');
const ctxHourlyPerc = document.getElementById('myChartHourlyPerc');
const ctxDailyTemp = document.getElementById('myChartDailyTemp');
const ctxDailyPerc = document.getElementById('myChartDailyPerc');
let data1;
let hourlyTemp = [];
let hourlyPerc = [];
let dailyTemp = [];
let dailyPerc = [];

document.addEventListener('load', weatherGetter()); // when the page loads, run weatherGetter.

/* Function called by event listener */
function weatherGetter(){
    // Getting the user geolocation.
    if('geolocation' in navigator) { 
        console.log('geolocation is available');
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;

            // Personal API Key for OpenWeatherMap API
            let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,alerts&units=imperial&appid=${key}`;
            let [day, month, date, year, time] = (Date()).split(" ");
            let [hour, minute, second] = (time).split(":");
            let date1 = `${month} ${date} ${year}`;
            let time1 = `${hour}:${minute}`;
            
            // Calling function, catching errors.
            getWeather(date1, time1, weatherUrl).catch(error => {
                console.log('error!');
                console.error(error);
            });

            
            //Creating Charts AFTER data has been created
            let d = new Date();
            let w = d.getDay();
            let h = d.getHours();
            charting(ctxHourlyTemp, hourlyTemp, "TEMPERATURE", hourArray(h));
            charting(ctxHourlyPerc, hourlyPerc, "PERCIPITATION", hourArray(h));
            charting(ctxDailyTemp, dailyTemp, "TEMPERATURE", dayArray(w));
            charting(ctxDailyPerc, dailyPerc, "PERCIPITATION", dayArray(w));
        })
    } else {
        console.log('geolocation is not avaliable');
    }
};

/* Function to GET Web API Data*/
async function getWeather(date, time, weatherUrl) {
    const responseWeather = await fetch(weatherUrl);
    data1 = await responseWeather.json();
    let dailyForcast = data1.current.weather[0].description;
    let percipitation = `${Math.round(data1.hourly[0].pop*100)}%`;
    let temperature = Math.round(data1.current.temp);
    let temperatureF = `${temperature}°F`;
    weatherIcon(data1);
    document.getElementById("temp").textContent = temperatureF;
    chartData(data1);
};

    // Making the picture match the weather object
let appendIcon = (pic, phrase) => { 
    document.getElementById("weather").src = pic;
    document.getElementById("advice").textContent = phrase;
};

let weatherIcon = (data1) => {
if (data1.current.weather[0].main == 'Clouds'){
    if (data1.current.weather[0].description == 'few clouds' || data1.current.weather[0].description == 'scattered clouds'){
        appendIcon("./pics/cloudy.svg", "No need for Shades")
    }else{
        appendIcon("./pics/overcast.svg", "It's a bit Dreary")
    }
}else if (data1.current.weather[0].main == 'Clear'){
    appendIcon("./pics/sunny.svg", "Bring some Shades")
}else if (data1.current.weather[0].main == 'Snow'){
    appendIcon("./pics/snowing.svg", "Wear a Coat")
}else if (data1.current.weather[0].main == 'Thunderstorm'){
    appendIcon("./pics/storming.svg", "Stay Inside Today")
}else if (data1.current.weather[0].main == 'Drizzle' || data1.current.weather[0].main == 'Rain') {
    appendIcon("./pics/raining.svg", "Bring an Umbrella")
} else {
    appendIcon("./index/pics/foggy.svg", "Visibility Low Be Careful")
}}

// Making day array
const dayArray = (currentDay) => {
    let week = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
    let weekObject = [];
    let rawDay = currentDay;
    for(let i = 0; i <= 7; i++) {
        weekObject.push(week[rawDay%7]);
        rawDay++;
    }
    return weekObject;
}

// Making hour array
const hourArray = (currentHour) => {
    let hours = ['12am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm'];
    let hourObject = [];
    let rawHour = currentHour;
    for(let i = 0; i <= 48; i++) {
        hourObject.push(hours[rawHour%24]);
        rawHour++;
    }
    return hourObject;
}

// Getting chart data
chartData = (data) => {
    data.daily.forEach((item, index) => {
        dailyTemp.push(convertTemp(item.temp.day));
        dailyPerc.push(item.pop*100);
    });
    data.hourly.forEach((item, index) => {
        hourlyTemp.push((convertTemp(item.temp)));
        hourlyPerc.push(item.pop*100);
    })
};

// Making things disappear on click
let mainChild = document.querySelectorAll(".main-child");
let main = document.querySelector("#main");
document.addEventListener('click', function(ev){
    if (ev.target.classList.contains("tab")){
        mainChild.forEach((item,index)=>{
            item.classList.toggle('hidden');
        });
        for(let i=0; i < main.children.length; i++) {
            main.children[i].style.cssText="z-index:1;";
        }
        if(ev.target.textContent == 'hourly') {
            document.querySelector('.hourly').classList.toggle('hidden');
            document.querySelector('.hourly').style.cssText = "z-index: 99";
        }else if(ev.target.textContent == 'daily') {
            document.querySelector('.daily').classList.toggle('hidden');
            document.querySelector('.daily').style.cssText = "z-index: 99";
        }else if(ev.target.textContent == 'journal') {
            document.querySelector('.journal').classList.toggle('hidden');
            document.querySelector('.journal').style.cssText = "z-index: 99";
        }else {
            console.log('tab error')
        };
    }
});