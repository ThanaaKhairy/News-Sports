

let standingApiUrl = `https://apiv2.allsportsapi.com/football/?&met=Standings&leagueId=207&APIkey=ca4d9da05ba38dd0f1d2d52a68c0ce7f3acffd0bb0dcaed192b1d4080ff225e6`;




async function getData(url) {
  let response = await fetch(url);
  return await response.json(); 
}




function displayStandings (data){
let SerieAStandings = ``;

for(let i =0 ;i< data.length ; i++){

    SerieAStandings += `
    <tr class="text-center">
                            <td class="fw-bold ucl-zone">${i+1}</td>
                            <td class="text-start">
                                <img src="${data[i].team_logo}" class="team-logo">
                                <strong>${data[i].standing_team}</strong>
                            </td>
                            <td>${data[i].standing_P}</td>
                            <td>${data[i].standing_W}</td>
                            <td>${data[i].standing_D}</td>
                            <td>${data[i].standing_L}</td>
                            <td>${data[i].standing_F}</td>
                            <td>${data[i].standing_A}</td>
                            <td>${data[i].standing_GD}</td>
                            <td class="fw-bold text-dark">${data[i].standing_PTS}</td>
                        </tr>
    
`

}

let tbody = document.getElementById('standings-body');
tbody.innerHTML = SerieAStandings;


}


async function startdisplayStandings() {

 let SerieAStandings = await getData(standingApiUrl);
console.log(SerieAStandings);
displayStandings(SerieAStandings.result.total);
}

startdisplayStandings();


 