const api_url = "http://ergast.com/api/f1/2022/driverStandings.json";

var prevUrl;
var nextUrl;

const getData = async () => {
  const data = await getApiData(api_url);
  const resource = await getApiData("./resource.json");
  updateHtml(data.MRData.StandingsTable.StandingsLists[0], resource);
};

const getApiData = async (apiUrl) => {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
};

const updateHtml = (data, resource) => {
  const racingLogo = document.getElementById("racing-logo");
  const rank = document.getElementById("d-rank");
  const driverName = document.getElementById("driver-fname");
  const carLogo = document.getElementById("car-logo");

  const { DriverStandings } = data;
  const params = getParams();
  const driverId = params.did;

  const driver = DriverStandings.filter(
    (item) => item.Driver.driverId === driverId
  )[0];

  const constr = resource.filter(
    (r) => r.constrId === driver.Constructors[0].constructorId
  )[0];

  let position = parseInt(driver.position);
  prevUrl = getUrl(position - 1, 15, DriverStandings);
  nextUrl = getUrl(position + 1, 15, DriverStandings);

  rank.innerText = driver.position;
  rank.style.color = constr.colorShade;
  racingLogo.src = constr.constrLogo;
  driverName.innerText =
    driver.Driver.givenName + " " + driver.Driver.familyName;
  carLogo.src = constr.constrCar;
  document.getElementById("wins").innerText = driver.wins;
  document.getElementById("number").innerText = driver.Driver.permanentNumber;
  document.getElementById("nationality").innerText = driver.Driver.nationality;
  document.getElementById("dob").innerText = driver.Driver.dateOfBirth;
  document.getElementById("constructor").innerText =
    driver.Constructors[0].name;
};

const getUrl = (pos, totalPos, data) => {
  pos = pos % totalPos;
  if(pos==0) pos = totalPos;
  const driver = data.filter((item) => item.position == pos)[0];
  console.log(driver, pos);
  const url = `/second.html?did=${driver.Driver.driverId}`;
  return url;
};

const showNext = () => {
  location.href = nextUrl;
};
const showPrev = () => {
  location.href = prevUrl;
};

const getParams = () => {
  const paramsList = location.search.split("?")[1].split("&");
  const params = {};
  paramsList.forEach((item) => {
    let param = item.split("=");
    params[param[0]] = param[1];
  });
  return params;
};

getData();
