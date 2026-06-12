const API_KEY = "YOUR_API_KEY";

const matchContainer =
document.getElementById("matches");

const filter =
document.getElementById("matchFilter");

filter.addEventListener("change", () => {
    loadMatches(filter.value);
});

async function loadMatches(type="all") {

    matchContainer.innerHTML =
    "<h2>Loading Matches...</h2>";

    try {

        const response = await fetch(
        "https://api.football-data.org/v4/competitions/WC/matches",
        {
            headers:{
                "X-Auth-Token":API_KEY
            }
        });

        const data = await response.json();

        matchContainer.innerHTML = "";

        data.matches.forEach(match => {

            const home =
            match.homeTeam.name;

            const away =
            match.awayTeam.name;

            const status =
            match.status;

            const date =
            new Date(match.utcDate)
            .toLocaleString();

            const homeScore =
            match.score.fullTime.home ?? 0;

            const awayScore =
            match.score.fullTime.away ?? 0;

            if(
                type==="live" &&
                status!=="LIVE" &&
                status!=="IN_PLAY" &&
                status!=="PAUSED"
            ){
                return;
            }

            if(
                type==="schedule" &&
                status!=="SCHEDULED"
            ){
                return;
            }

            if(
                type==="finished" &&
                status!=="FINISHED"
            ){
                return;
            }

            let statusClass="";
            let statusText=status;

            if(
                status==="LIVE" ||
                status==="IN_PLAY"
            ){
                statusClass="live";
                statusText="🔴 LIVE";
            }

            else if(
                status==="SCHEDULED"
            ){
                statusClass="schedule";
                statusText="📅 Upcoming Match";
            }

            else if(
                status==="FINISHED"
            ){
                statusClass="finished";
                statusText="✅ Finished";
            }

            matchContainer.innerHTML += `
            <div class="match-card">

                <div class="teams">

                    <div class="team">
                        ${home}
                    </div>

                    <div class="score">
                        ${homeScore}
                        -
                        ${awayScore}
                    </div>

                    <div class="team">
                        ${away}
                    </div>

                </div>

                <div class="info">
                    <p class="${statusClass}">
                        ${statusText}
                    </p>

                    <p>
                        🏆 ${home} vs ${away}
                    </p>

                    <p>
                        ⏰ ${date}
                    </p>
                </div>

            </div>
            `;
        });

    }

    catch(error){

        matchContainer.innerHTML =
        "<h2>Unable to Load Matches</h2>";

        console.log(error);
    }
}

loadMatches();

setInterval(() => {
    loadMatches(filter.value);
}, 30000);