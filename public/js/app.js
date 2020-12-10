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
let hourlyTemp = [];
let hourlyPerc = [];
let dailyTemp = [];
let dailyPerc = [];
let home = document.querySelectorAll(".home");
let main = document.getElementById('main');

// Getting the user geolocation.
if('geolocation' in navigator) { 
    console.log('geolocation is available');
    navigator.geolocation.getCurrentPosition((position) => {
        
        appendLoader();
        
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        
        // Personal API Key for OpenWeatherMap API
        let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,alerts&units=imperial&appid=${key}`;
        
        // Calling function, catching errors.
        getWeather(weatherUrl).catch(error => {
            console.log('error!');
            console.error(error);
        });
        
        //Creating Charts AFTER data has been created
        let h = new Date().getHours();
        charting(ctxHourlyTemp, hourlyTemp, "TEMPERATURE", hourArray(h));
        charting(ctxHourlyPerc, hourlyPerc, "PERCIPITATION", hourArray(h));

        let w = new Date().getDay();
        charting(ctxDailyTemp, dailyTemp, "TEMPERATURE", dayArray(w));
        charting(ctxDailyPerc, dailyPerc, "PERCIPITATION", dayArray(w));
    })
} else {
    console.log('geolocation is not avaliable');
}

/* Function to GET Web API Data*/
async function getWeather(weatherUrl) {
    const responseWeather = await fetch(weatherUrl);
    let data1 = await responseWeather.json();
    let temperature = Math.round(data1.current.temp);
    let temperatureF = `${temperature}°F`;
    weatherIcon(data1);
    document.getElementById("temp").textContent = temperatureF;
    chartData(data1);
    removeLoader();
    home.forEach((item) => {
        fadeIn(item);
    });
};

    // Making the picture match the weather object
let appendIcon = (pic, phrase) => { 
    document.getElementById("weather").src = pic;
    document.getElementById("advice").textContent = phrase;
};

let weatherIcon = (weatherObject) => {
if (weatherObject.current.weather[0].main == 'Clouds'){
    if (weatherObject.current.weather[0].description == 'few clouds' || weatherObject.current.weather[0].description == 'scattered clouds'){
        appendIcon("./pics/cloudy.svg", "No need for Shades")
    }else{
        appendIcon("./pics/overcast.svg", "It's a bit Dreary")
    }
}else if (weatherObject.current.weather[0].main == 'Clear'){
    appendIcon("./pics/sunny.svg", "Bring some Shades")
}else if (weatherObject.current.weather[0].main == 'Snow'){
    appendIcon("./pics/snowing.svg", "Wear a Coat")
}else if (weatherObject.current.weather[0].main == 'Thunderstorm'){
    appendIcon("./pics/storming.svg", "Stay Inside Today")
}else if (weatherObject.current.weather[0].main == 'Drizzle' || weatherObject.current.weather[0].main == 'Rain') {
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
    data.daily.forEach((item) => {
        dailyTemp.push(item.temp.day);
        dailyPerc.push(item.pop*100);
    });
    data.hourly.forEach((item) => {
        hourlyTemp.push(item.temp);
        hourlyPerc.push(item.pop*100);
    })
};

// checks if tab => compares tab text to class names => fades in/out
document.addEventListener('click', function(ev){
    if (ev.target.classList.contains('tab')) {
        Array.from(main.children).forEach((item) => {
            if (item.classList.contains(ev.target.innerText)) {
                fadeIn(item);
            }else {
                fadeOut(item);
            }
        })
    }
});

const fadeOut = (endGone) => {
    endGone.style.opacity = '0';
    setTimeout(() => {
        endGone.style.display = 'none';
    } , 500);
}

const fadeIn = (endHere) => {
    endHere.style.display = 'block';
    setTimeout(() => {
        endHere.style.opacity = '1';
    } , 500);
}

// appends loader after user agrees to submit geolocation
let appendLoader = () => {
    let loading = document.createElement('img');
    loading.src = '/public/pics/loading.svg';
    loading.classList.add('loader');
    main.append(loading);
}

// removes loading icon, once data is fetched
let removeLoader = () => {
    Array.from(main.children).forEach((item) => {
        if(item.classList.contains('loader')) { item.remove() };
    })
}