/* ======== URLs ======== */
let currencyUrl = `https://currencyapi.net/api/v2/rates?key=5c1333cbf95057fa60a11d41edc831cdca72&output=json`;

let PoliticsNewsUrl = `https://gnews.io/api/v4/top-headlines?category=Politics&lang=en&country=us&max=10&apikey=f9c0ea89a627b3b8ab50d6cb528c94a2`;

let EconomyNewsUrl = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=e1191e5e926e485ab165d61b093354ea`;

let SportsNewsUrl = `https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=e1191e5e926e485ab165d61b093354ea`;

let technologyNewsUrl = `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=e1191e5e926e485ab165d61b093354ea`;

/* ======== Generic Fetch with Error Handling ======== */
async function getData(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error("Fetch error for:", url, err);
        return {}; // object فارغ بدل أن يكسر الكود
    }
}

/* ======== Weather using Geolocation ======== */
function getWeather() {
    if (!navigator.geolocation) return console.log("Geolocation not supported");
    
    navigator.geolocation.getCurrentPosition(
        async position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            let apiKey = "71c45436411e12ee07f996ef1d2180ea";
            let weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            let data = await getData(weatherURL);
            if (data.main) {
                document.getElementById("temperature").innerHTML = data.main.temp + " °C";
                document.getElementById("city").innerHTML = data.name;
            }
        },
        error => console.log("Location denied or error", error)
    );
}

/* ======== Currency Converter ======== */
async function convertCurrency() {
    let amount = document.getElementById("amount").value;
    let to = document.getElementById("to").value;

    let data = await getData(currencyUrl);
    let rate = data.rates?.[to];
    if (rate) {
        let result = amount * rate;
        document.getElementById("result").innerHTML = result.toFixed(2) + " " + to;
    } else {
        document.getElementById("result").innerHTML = "Conversion failed";
    }
}

/* ======== Live Matches ======== */
async function getLiveMatches() {
    const API_KEY = "ca4d9da05ba38dd0f1d2d52a68c0ce7f3acffd0bb0dcaed192b1d4080ff225e6";
    const url = `https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=${API_KEY}`;

    let data = await getData(url);
    const list = document.getElementById("live-matches-list");
    list.innerHTML = "";

    if (data.result?.length > 0) {
        const matches = data.result.slice(0, 5);
        let html = "";
        matches.forEach(match => {
            html += `
                <hr>
                <div class="d-flex flex-wrap flex-sm-row flex-md-column flex-lg-row align-items-center justify-content-center mb-2 text-center">
                    <div class="d-flex align-items-center me-lg-3 mb-1 mb-lg-0">
                        <img src="${match.home_team_logo}" alt="${match.event_home_team}" class="img-fluid me-2" style="max-width:30px; max-height:30px;">
                        <strong>${match.event_home_team}</strong>
                    </div>
                    <div class="w-100 text-center my-1">
                        <span class="fw-bold">vs</span>
                    </div>
                    <div class="d-flex align-items-center ms-lg-3">
                        <img src="${match.away_team_logo}" alt="${match.event_away_team}" class="img-fluid me-2" style="max-width:30px; max-height:30px;">
                        <strong>${match.event_away_team}</strong>
                    </div>
                </div>
                <div class="text-center mb-2">
                    <span class="fw-bold">${match.event_final_result || "0 - 0"}</span> |
                    <small class="text-muted">${match.league_name} (${match.event_status || 0}')</small>
                </div>
            `;
        });
        list.innerHTML = html;
    } else {
        list.innerHTML = "<li class='list-group-item'>No live matches right now</li>";
    }
}

/* ======== Display News ======== */
function displayNews(data, type) {
    let News = ``;
    for (let i = 0; i < (data.length || 0); i++) {
        News += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 d-flex flex-column">
                    <img src="${data[i].urlToImage || data[i].image || '../download.jpg'}" 
                         class="card-img-top" 
                         style="width:100%; height:200px; object-fit:cover;"
                         onerror="this.src='../download.jpg'">        
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${data[i].title || "No title"}</h5>
                        <p class="card-text">${data[i].source?.name || "Unknown"} | ${data[i].publishedAt ? new Date(data[i].publishedAt).toLocaleDateString() : ""}</p>
                        <a href="${data[i].url || '#'}" target="_blank" class="btn btn-warning mt-auto">Read More</a>
                    </div>
                </div>
            </div>
        `;
    }
    document.getElementById(type).innerHTML = News;
}

/* ======== Start Display News ======== */
async function startDisplayNews() {
    try {
        getLiveMatches();
        getWeather();

        let PoliticsNews = await getData(PoliticsNewsUrl);
        displayNews(PoliticsNews.articles?.slice(0, 6) || [], 'PoliticsNews');

        let EconomyNews = await getData(EconomyNewsUrl);
        displayNews(EconomyNews.articles?.slice(0, 5) || [], 'EconomyNews');

        let SportsNews = await getData(SportsNewsUrl);
        displayNews(SportsNews.articles?.slice(0, 6) || [], 'SportsNews');

        let TechnologyNews = await getData(technologyNewsUrl);
        displayNews(TechnologyNews.articles?.slice(0, 5) || [], 'technologyNews');

    } catch (error) {
        console.error("Error in startDisplayNews:", error);
    }
}

/* ======== Run ======== */
startDisplayNews();
