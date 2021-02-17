function attachEvents() {
  const submitBtn = document.getElementById("submit");
  const inputElement = document.getElementById("location");
  const visibleDiv = document.getElementById("forecast");

  const topDiv = document.getElementById('current');
  const bottomDiv = document.getElementById('upcoming');

  const mainURL = "https://judgetests.firebaseio.com/locations.json";
  const baseUrl = "https://judgetests.firebaseio.com/forecast/";

  let symbols = {
    Sunny: "&#x2600;",
    "Partly sunny": "&#x26C5;",
    Overcast: "&#x2601;",
    Rain: "&#x2614;",
    Degrees: "&#176;",
  };

  submitBtn.addEventListener("click", () => {
    fetch(mainURL)
      .then((response) => response.json())
      .then((data) => {
        let locations = data.find((city) => city.name === inputElement.value);

        
        let today = fetch(
          `${baseUrl}today/${locations.code}/.json`
        ).then((response) => response.json());
        let upcoming = fetch(
          `${baseUrl}upcoming/${locations.code}/.json`
        ).then((response) => response.json());

        Promise.all([today, upcoming])
          .then(([currentData, upcomingData]) => {
            //current
            let currentSymbol = symbols[currentData.forecast.condition];
            let currentHigh = currentData.forecast.high;
            let currentLow = currentData.forecast.low;
            let currentWeather = currentData.forecast.condition;
            
            
            topDiv.innerHTML = "";
            bottomDiv.innerHTML = "";
            let forecastDiv = createElements("div", 'forecasts', "");
            let conditionalSymbol = createElements('span', 'condition symbol', `${currentSymbol}`)
            forecastDiv.appendChild(conditionalSymbol);
            
            let mainSpan = createElements('span', "condition", "");

            let citySpan = createElements('span', "forecast-data", `${currentData.name}`);
            let tempSpan = createElements('span', "forecast-data", `${currentHigh}${symbols.Degrees}/${currentLow}${symbols.Degrees}`);
            let weatherSpan = createElements('span', "forecast-data", `${currentWeather}`);
            mainSpan.appendChild(citySpan)
            mainSpan.appendChild(tempSpan)
            mainSpan.appendChild(weatherSpan)
            forecastDiv.appendChild(mainSpan)
            topDiv.appendChild(forecastDiv);
            
            
            //upcoming
            let upcomingDiv = createElements('div', 'forecast-info', "");
  
            upcomingData.forecast.forEach(cond => {
                let upcomingSpan = createElements("span", 'upcoming', "")
                let upcomingSymbols = symbols[cond.condition]
                let upcomingSymbol = createElements('span', 'symbol', `${upcomingSymbols}`);
                let upcomingTempSpan = createElements('span', 'forecast-data', `${cond.high}${symbols.Degrees}/${cond.low}${symbols.Degrees}`);
                let upcomingConditionSpan = createElements('span', 'forecast-data', `${cond.condition}`);
                upcomingSpan.appendChild(upcomingSymbol);
                upcomingSpan.appendChild(upcomingTempSpan);
                upcomingSpan.appendChild(upcomingConditionSpan);    
                upcomingDiv.appendChild(upcomingSpan)
            })
            
            
             bottomDiv.appendChild(upcomingDiv);

             inputElement.value = '';
            visibleDiv.style.display = "block";
          })
          .catch(error => console.log(error));
      });
  });
}
attachEvents();

function createElements(ele, classes, content){
    let element = document.createElement(ele);
    element.className = classes;
    element.innerHTML = content; 
    return element;
}

