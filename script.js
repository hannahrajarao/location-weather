const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};
let latitude;
let longitude;
let mydata;
let generalData;
navigator.geolocation.getCurrentPosition(success, error, options);

async function success(pos) {
    const crd = pos.coords;
    console.log(`Latitude : ${crd.latitude}`);
    document.getElementById('latitude').innerHTML = crd.latitude;
    console.log(`Longitude: ${crd.longitude}`);
    document.getElementById('longitude').innerHTML = crd.longitude;
    //get coordinates
    latitude = crd.latitude;
    longitude = crd.longitude;
    // getGrid(latitude, longitude);
    //get coordinate url
    const coordJson = await getJsonFromUrl(`https://api.weather.gov/points/${latitude},${longitude}`);
    generalData = coordJson;
    console.log(coordJson['properties']['forecast']);
    const city = generalData['properties']['relativeLocation']['properties']['city'];
    const state = generalData['properties']['relativeLocation']['properties']['state'];    
    document.getElementById('city-state').innerHTML = city+', '+state;
    const grid = await getJsonFromUrl(coordJson['properties']['forecast']);
    populateTable(grid['properties']['periods']);
    mydata = grid
}

function populateTable(periods) {
    const tbl = document.getElementById('table');
    for (let i = 0; i < periods.length; i++) {
        const tr = tbl.insertRow();
        const currentItem = periods[i];

        if(!currentItem['isDaytime']) {
            tr.style.background = '#333';
            tr.style.color = 'white';
        }

        const td_time = tr.insertCell();
        td_time.appendChild(document.createTextNode(currentItem['name']));

        const td_temp = tr.insertCell();
        td_temp.appendChild(document.createTextNode(currentItem['temperature']));
        // td_temp.style.background = `rgb(${255-currentItem['temperature']*2}, 255, 255)`


        const td_forecast = tr.insertCell();
        td_forecast.appendChild(document.createTextNode(periods[i]['detailedForecast']));

        const td_icon = tr.insertCell();
        const img = document.createElement('img');
        img.src = periods[i]['icon'].replace('size=medium', 'size=large');
        td_icon.appendChild(img);
        
    }
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

async function getJsonFromUrl(url) {
    let response = await fetch(url);
    let data = await response.json()
    return data;
}

function getGrid(lat, lon) {
    fetch(`https://api.weather.gov/points/${lat},${lon}`)
        .then((response) => response.json())
        .then((data) => mydata = data);

    console.log(`https://api.weather.gov/points/${lat},${lon}`);
}