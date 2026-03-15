




let statsCardsApiUrl = `https://apiv2.allsportsapi.com/football/?&met=Teams&leagueId=207&APIkey=ca4d9da05ba38dd0f1d2d52a68c0ce7f3acffd0bb0dcaed192b1d4080ff225e6`;

async function getData(url) {
    let response = await fetch(url);
    return await response.json();
}

const scorersUrl = `https://apiv2.allsportsapi.com/football/?met=Topscorers&leagueId=207&APIkey=ca4d9da05ba38dd0f1d2d52a68c0ce7f3acffd0bb0dcaed192b1d4080ff225e6`;

const teamsUrl = `https://apiv2.allsportsapi.com/football/?&met=Teams&leagueId=207&APIkey=ca4d9da05ba38dd0f1d2d52a68c0ce7f3acffd0bb0dcaed192b1d4080ff225e6`;

async function getPlayersInfo() {

    let scorersData = await getData(scorersUrl);

    let playersArray = scorersData.result.map(player => ({
        player_id: player.player_key
    }));

    let playerIds = new Set(playersArray.map(p => p.player_id));

    let teamsData = await getData(teamsUrl);

    let playersData = [];

    teamsData.result.forEach(team => {

        team.players.forEach(player => {

            if (playerIds.has(player.player_key)) {

                playersData.push({
                    ...player,
                    team_name: team.team_name,
                    team_logo: team.team_logo
                });

            }

        });

    });

    displayTeams(playersData.sort((a,b) => b.player_goals - a.player_goals));
}

getPlayersInfo();



function displayTeams(playersData) {

    let rowsHTML = "";

    for (let i = 0; i < playersData.length; i++) {

        let player = playersData[i];

        rowsHTML += `
        <tr>
            <td class="fw-bold ucl-zone">${i + 1}</td>

            <td>
                <div class="d-flex align-items-center">
                    <img 
                        src="${player.player_image}" 
                        onerror="this.src='../94d83656-7b86-4e58-a8e0-d5a9a83e07b6-1024x1024.webp'" 
                        class="rounded-circle me-2 border" 
                        width="40" height="40" 
                        alt="${player.player_name}">
                    <span class="fw-bold">${player.player_name}</span>
                </div>
            </td>

            <td>
                <div class="d-flex align-items-center">
                    <img src="${player.team_logo}" class="me-2" width="25" height="25">
                    <span class="small text-muted">${player.team_name}</span>
                </div>
            </td>

            <td class="text-center fw-bold">${player.player_goals || 0}</td>

            <td class="text-center">
                <span class="badge text-dark">${player.player_assists || 0}</span>
            </td>

            <td class="text-center">
                <span class="badge bg-warning text-dark">${player.player_yellow_cards || 0}</span>
            </td>

            <td class="text-center">
                <span class="badge bg-danger">${player.player_red_cards || 0}</span>
            </td>

        </tr>
        `;
    }

    let tbody = document.getElementById("all-player-stats");

    if (tbody) {
        tbody.innerHTML = rowsHTML;
    }
}