let newsUrl = `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=ca4d9da05ba38dd0f1d2d52a68c0ce7f3acffd0bb0dcaed192b1d4080ff225e6&from=2026-03-01&to=2026-06-29&leagueId=207`;

let searchBtn = document.getElementById('searchBtn');
let dateFrom =document.getElementById('dateFrom');
let dateTo =document.getElementById('dateTo');
let Results=[]



console.log(dateFrom.value)

searchBtn.onclick = async function searchByDate() {

    searchBtn.disabled = true;

    try {
        let searchUrl = `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=ca4d9da05ba38dd0f1d2d52a68c0ce7f3acffd0bb0dcaed192b1d4080ff225e6&from=${dateFrom.value}&to=${dateTo.value}&leagueId=207`;

        let data = await getData(searchUrl);
        let Results = data.result;

        displayMatches(Results);

    } catch (error) {
        console.error(error);
    }

    searchBtn.disabled = false;
};



async function getData(url) {
  let response = await fetch(url);
  return await response.json(); 
}

function displayMatches(data) {
    let matchesHTML = ``;
    console.log("Processing Match Data:", data);

    for (let i = 0; i < data.length; i++) {
        const match = data[i];
        let statusContent = "";

        if (match.event_status === "Finished") {
            statusContent = `
                <div class="score fw-bold fs-3 text-dark">${match.event_final_result}</div>
                <div class="badge bg-secondary px-3 py-1">FT</div>
            `;
        } 
        else if (match.event_live === "1" || (!isNaN(parseInt(match.event_status)))) {
            statusContent = `
                <div class="score fw-bold fs-3 text-danger">${match.event_final_result}</div>
                <div class="badge bg-danger pulse-animation px-3 py-1">LIVE ${match.event_status}</div>
            `;
        } 
        else {
            statusContent = `
                <div class="match-time fw-bold fs-4 text-primary">${match.event_time}</div>
                <div class="match-date small text-muted">${match.event_date}</div>
                <div class="badge border border-primary text-primary mt-1">Upcoming</div>
            `;
        }

        matchesHTML += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="match-card bg-white shadow-sm rounded-4 p-4 text-center h-100">
                    <div class="d-flex align-items-center justify-content-center mb-4 opacity-75">
                        <img src="${match.league_logo}" alt="league" width="22" class="me-2">
                        <span class="small fw-semibold text-uppercase tracking-wider">${match.league_name}</span>
                    </div>

                    <div class="row align-items-center">
                        <div class="col-4">
                            <img src="${match.home_team_logo}" class="img-fluid mb-2" style="max-height: 60px;" alt="${match.event_home_team}">
                            <div class="fw-bold small">${match.event_home_team}</div>
                        </div>

                        <div class="col-4 px-0">
                            ${statusContent}
                        </div>

                        <div class="col-4">
                            <img src="${match.away_team_logo}" class="img-fluid mb-2" style="max-height: 60px;" alt="${match.event_away_team}">
                            <div class="fw-bold small">${match.event_away_team}</div>
                        </div>
                    </div>
                    
                    <div class="mt-3 x-small text-muted" style="font-size: 0.7rem;">
                         📍 ${match.event_stadium || 'TBD'}
                    </div>
                </div>
            </div>
        `;
    }

    let container = document.getElementById('matches-container');
    if (container) {
        container.innerHTML = matchesHTML;
    }
}


async function startDIisplayMatches() {

let matches = await getData(newsUrl);
displayMatches(matches.result);
}

startDIisplayMatches();


