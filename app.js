const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const notFoundSection = document.querySelector('.not-found')
const apiKey = '031018a04b4d859babbc15c116553284'
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection = document.querySelector('.weather-info')
const countryTxt = document.querySelector('.county-text')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-text')
const windValueTxt = document.querySelector('.wind-value-text')
const weatherSummaryImg = document.querySelector('.weather-summary-image')
const currentDateTxt = document.querySelector('.current-date-text')

const forecastItemsContainer = document.querySelector('.forecast-items-container')
searchBtn.addEventListener("click",()=>{
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = '';
        cityInput.blur(); 
    }
})

cityInput.addEventListener('keydown',(event)=>{

    if(event.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = '';
        cityInput.blur();
    }

})

function getCurrentData(){
    const currentDate = new Date();
    const options ={
        weekday:'short',
        day:'2-digit',
        month:'short'
    }

    return currentDate.toLocaleDateString('en-GB',options)
}

function getWeatherIcon(id){
    if(id <= 232){
        return 'thunderstorm.svg'
    }
    if(id <= 321){
        return 'drizzle.svg'
    }
    if(id <= 531){
        return 'rain.svg'
    }
    if(id <= 622){
        return 'snow.svg'
    }
    if(id <= 781){
        return 'atmosphere.svg'
    }
    if(id <= 800){
        return 'clear.svg'
    }
    else{
        return 'clouds.svg'
    }
}
async function getFetchData(endPoint,city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)
    return response.json()
}
 async function updateWeatherInfo(city){
    const weatherData = await  getFetchData('weather',city)
    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return;
    }

    const {
        name:county,
        main:{temp,humidity},
        weather :[{id,main}],
        wind:{speed}
    }=weatherData

    countryTxt.textContent = county;
    tempTxt.textContent = Math.round(temp) + '℃'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed +'M/s'
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    currentDateTxt.textContent = getCurrentData()
    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)
    console.log(weatherData)
}

function showDisplaySection(section){
   [weatherInfoSection,searchCitySection,notFoundSection].forEach(section =>{
    section.style.display = 'none'
   })

   section.style.display = 'flex'
}

async function updateForecastsInfo(city){
    const forecastsDate = await getFetchData('forecast',city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    console.log(forecastsDate)
    forecastItemsContainer.innerHTML =''
    forecastsDate.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
             console.log(forecastWeather)
            updateForecastsItems(forecastWeather)
        }
    })
}

function updateForecastsItems(weatherData){
    const {
        dt_txt:date,
        weather:[{id}],
        main:{temp}
    }=weatherData

    const dateTake = new Date(date)

    const dateOption ={
        day:"2-digit",
        month:"short"
    }
    const dateResult = dateTake.toLocaleDateString('en-US',dateOption)
 
    const forecastItem = `
     
       <div class="forecast-item">
                <h5 class="forecast-item-date regular-text">${dateResult}</h5>
                <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
                <h5 class="forecast-item-temp">${Math.round(temp)}℃</h5>
        </div>
     
     `
    forecastItemsContainer.insertAdjacentHTML('beforeend',forecastItem)
}