// Chart.js
function charting(ctx, temp, perc, x) {
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: x,
            datasets: [
                {
                    label: 'Temperature °F',
                    yAxisID: 'Temp',
                    data: temp,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.3)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                    pointRadius: 0
                },
                {
                    label: 'Percipitation %',
                    yAxisID: 'Perc',
                    data: perc,
                    backgroundColor: [
                        'rgb(255, 206, 31, 0.3)',
                    ],
                    borderColor: [
                        'rgb(255, 206, 31)',
                    ],
                    borderWidth: 1,
                    pointRadius: 0
                }
            ]
        },
        options: {
            legend: {
                labels: {
                    fontColor: '#ffce21',
                    defaultFontSize: 64,
                    defaultFontFamily: "'Helvetica', sans-serif",
                    defaultFontStyle: "bold"
                }
            },
            scales: {
                yAxes: [
                    {
                        id: 'Temp',
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    {
                        id: 'Perc',
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    });
};



let resizeChart = () => {
    let chart = document.querySelectorAll('.chart'); 
    Array.from(chart).forEach((item) => {
        item.style.height = '30vh';
        item.style.width = '70vw';
    });
}


// Global Variables
const key = '5f6df12f283bc1a30cd52357ca119ed4';


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
        const ctxHourly = document.getElementById('myChartHourly');
        charting(ctxHourly, hourlyTemp, hourlyPerc, hourArray(h));

        let w = new Date().getDay();
        const ctxDaily = document.getElementById('myChartDaily');
        charting(ctxDaily, dailyTemp, dailyPerc, dayArray(w));

        resizeChart();
    })
} else {
    console.log('geolocation is not avaliable');
    alert('Please turn your location on and reload.')
}

/* Function to GET Web API Data*/
async function getWeather(weatherUrl) {
    const responseWeather = await fetch(weatherUrl);
    let weatherData = await responseWeather.json();
    let temperature = Math.round(weatherData.current.temp);
    let temperatureF = `${temperature}°F`;
    document.getElementById("temp").textContent = temperatureF;
    console.log(weatherData);
    weatherIcon(weatherData);
    chartData(weatherData);
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
    let weekList = [];
    let rawDay = currentDay;
    for(let i = 0; i <= 7; i++) {
        weekList.push(week[rawDay%7]);
        rawDay++;
    }
    return weekList;
}

// Making hour array
const hourArray = (currentHour) => {
    let hours = ['12am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm'];
    let hourList = [];
    let rawHour = currentHour;
    for(let i = 0; i <= 48; i++) {
        hourList.push(hours[rawHour%24]);
        rawHour++;
    }
    return hourList;
}

// Getting chart data
chartData = (data) => {
    data.hourly.forEach((item) => {
        hourlyTemp.push(item.temp);
        hourlyPerc.push(item.pop * 100);
            console.log('here');
    })
    data.daily.forEach((item) => {
        dailyTemp.push(item.temp.day);
        dailyPerc.push(item.pop*100);
    });
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
    loading.src = './pics/loading.svg';
    loading.classList.add('loader');
    main.append(loading);
}

// removes loading icon, once data is fetched
let removeLoader = () => {
    Array.from(main.children).forEach((item) => {
        if(item.classList.contains('loader')) { item.remove() };
    })
}