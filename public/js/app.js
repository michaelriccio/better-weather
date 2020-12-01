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
const key = "5f6df12f283bc1a30cd52357ca119ed4";
const ctxHourlyTemp = document.getElementById('myChartHourlyTemp');
const ctxHourlyPerc = document.getElementById('myChartHourlyPerc');
const ctxDailyTemp = document.getElementById('myChartDailyTemp');
const ctxDailyPerc = document.getElementById('myChartDailyPerc');
// const optionsHour = ;
// const optionsDaily = ;
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
            let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={minutely}&appid=${key}`;

            let [day, month, date, year, time] = (Date()).split(" ");
            let [hour, minute, second] = (time).split(":");
            let date1 = `${month} ${date} ${year}`;
            let time1 = `${hour}:${minute}`;
            
            // Calling function, catching errors.
            getWeather(date1, time1, weatherUrl).catch(error => {
                console.log('error!');
                console.error(error);
            });

            getJournal('/all')
            .catch(error => {
                console.log('promise error');
                console.error(error);
            });
            let d = new Date();
            let w = d.getDay();
            let h = d.getHours();

            //Creating Charts AFTER data has been created
            charting(ctxHourlyTemp, hourlyTemp, "TEMPERATURE", hourArray(h));
            charting(ctxHourlyPerc, hourlyPerc, "PERCIPITATION", hourArray(h));
            charting(ctxDailyTemp, dailyTemp, "TEMPERATURE", dayArray(w));
            charting(ctxDailyPerc, dailyPerc, "PERCIPITATION", dayArray(w));
        })
    } else {
        console.log('geolocation is not avaliable');
    }
};

// Event listener to add function to existing HTML DOM element

/* Function to GET Web API Data*/
async function getWeather(date, time, weatherUrl) {
    const responseWeather = await fetch(weatherUrl);
    data1 = await responseWeather.json();
    let dailyForcast = data1.current.weather[0].description;
    let percipitation = `${Math.round(data1.hourly[0].pop*100)}%`;
    let temperature = convertF(data1.current.temp);
    let postInfo = [date, time, dailyForcast, percipitation, temperature];
    postJournal('/post', postInfo);
    weatherIcon(data1);
    tempIcon(temperature);
    chartData(data1);
};

/* Function to POST Project Data */
async function postJournal(url='', data={}) {
    const optionPost = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    const response = await fetch(url, optionPost); 
    const journalPost = await response.json(); 
    console.log(journalPost);
};

/* Function to GET Project Data */
async function getJournal(url){
    const response = await fetch(url);
    const journal = await response.json();
    console.log({journal});
    makeTable(journal);
};

    // Making the picture match the weather object
let weatherIcon = (data1) => {
    let icon = document.getElementById("weather");
    let advice = document.getElementById("advice");
if (data1.current.weather[0].main == 'Clouds'){
    if (data1.current.weather[0].description == 'few clouds' || data1.current.weather[0].description == 'scattered clouds'){
        icon.src = "/pics/cloudy.svg";
        advice.textContent = "No need for Shades";
    }else{
        icon.src = "/pics/overcast.svg";
        advice.textContent = "It's a bit Dreary";
    }
}else if (data1.current.weather[0].main == 'Clear'){
    icon.src = "/pics/sunny.svg";
    advice.textContent = "Bring some Shades";
}else if (data1.current.weather[0].main == 'Snow'){
    icon.src = "/pics/snowing.svg";
    advice.textContent = "Wear a Coat";
}else if (data1.current.weather[0].main == 'Thunderstorm'){
    icon.src = "/pics/storming.svg";
    advice.textContent = "Stay Inside Today";
}else if (data1.current.weather[0].main == 'Drizzle' || data1.current.weather[0].main == 'Rain') {
    icon.src = "/pics/raining.svg";
    advice.textContent = "Bring an Umbrella";
} else {
    icon.src = "/pics/foggy.svg";
    advice.textContent = "Visibility Low Be Careful";
}}

// Creating temperature on top of icon
tempIcon = (temp) => {
    tempPlacement = document.getElementById("temp");
    tempPlacement.textContent = temp;
}

//Getting Fahrenheit from Kelvin
const convertF = (rawTemp) => {return `${Math.round(((rawTemp-273.15)*1.8)+32)}°F`;};
const convertTemp = (rawTemp) => {return Math.round(((rawTemp-273.15)*1.8)+32)};

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

// Making table and appending
function makeTable(dataList) {
    let pastLog = document.querySelector('.pastLog');
    if(dataList.length == 0) {
        let noContent = document.createElement('h1');
        noContent.textContent = 'There are no previous entries, try refreshing your page.';
        let journalClass = document.querySelector('.journal');
        console.log(journalClass);
        journalClass.appendChild(noContent);
    }else {
        for (let i=0; i < dataList.length; i++) {
            let makeRow = document.createElement('tr');
            pastLog.appendChild(makeRow);
            for (let h=0; h < 5; h++) {
                let makeColumn = document.createElement('td');
                makeColumn.textContent = dataList[i][h];
                makeColumn.setAttribute('class', 'row-here');
                pastLog.children[i].appendChild(makeColumn);
            }
        }
    }
}