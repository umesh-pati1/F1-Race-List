const api_url = "http://ergast.com/api/f1/2022/driverStandings.json";

getData();

var data;
async function getData() {
  const data = await getApiData(api_url);
  const resource = await getApiData("./resource.json");
  renderList(data.MRData.StandingsTable.StandingsLists[0], resource);
}

async function getApiData(apiUrl) {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

function renderList(data, resource) {
  console.log(data, resource);
  const { season, round, DriverStandings } = data;
  const header = document.querySelector("header h1");
  const list = document.querySelector(".rank-list");

  header.innerHTML = `season ${season} - round ${round} rankings`;
  DriverStandings.forEach((item, i) => {
    const node = document.createElement("li");
    if (i < 15) {
      const constr = resource.filter(
        (r) => r.constrId === item.Constructors[0].constructorId
      )[0];
      node.innerHTML = `
      <a href="/second.html?did=${item.Driver.driverId}">
      <div class="d-rank" style="color:${
        i <= 1 ? constr.colorShade : "#000000"
      };">${item.position}</div>
          <div class="d-name">
            <img src="${constr.constrLogo}"  /><span id="driver-fname">${
        item.Driver.givenName + " " + item.Driver.familyName
      }</span>
          </div>
          <div class="d-details">
            <div><span id="points">${item.points}</span>Points</div>
            <div><span id="wins">${item.wins}</span>Wins</div>
            <div><span id="number">${
              item.Driver.permanentNumber
            }</span>Number</div>
          </div>
          <img class="d-image" src="${constr.constrCar}" /></a>
    `;
      list.append(node);
    }
  });
}
