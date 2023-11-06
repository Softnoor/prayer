const now = new Date();
let year = now.getFullYear() + 1;
let latitude, longitude;
let method = 2;
let apiURLBase = "https://api.aladhan.com/v1/calendar/";
let data;

let hijriMonths = [
  'Muharram',
  'Safar',
  'Rabi\' ul Awal',
  'Rabi\' Al-Akhar',
  'Jumada Al-Ula',
  'Jumada Al-Ukhra',
  'Rajab',
  'Sha\'ban',
  'Ramadan',
  'Shawwal',
  'Dhul Qi\'dah',
  'Dhul Hijjah'
]

document.getElementById("year").value = year;
function createTable() {
  year = document.getElementById("year")?.value ?? year;
  latitude = "42.30448296058161";
  longitude = "-83.14320741914071";

  apiURL = `${apiURLBase}${year}?latitude=${latitude}&longitude=${longitude}&method=${method}&latitudeAdjustmentMethod=1`;

  fetch(apiURL)
    .then((response) => response.json())
    .then((json) => (data = json))
    .then(() => {
      document.getElementById("table-body").innerHTML = getTableBody(
        data.data
      );
    })
    .then(() => {
      let table = new DataTable("#myTable", {
        dom: 'BRlfrtip',
        ordering: false,
        paging: false,
        buttons: ["csv"],
        fixedHeader: true,
        responsive: true
      });
    });
}

function getTableBody(yearData) {
  let tableBody = "";
  for (let monthNumber = 1; monthNumber <= 12; monthNumber++) {
    let monthData = yearData[monthNumber];
    for (let dayNumber = 0; dayNumber < monthData.length; dayNumber++) {
      tableBody =
        tableBody +
        `
        <tr>
            <th>${monthData[dayNumber].date.readable}</th>
            <th>${monthData[dayNumber].date.hijri.day} ${
          hijriMonths[+monthData[dayNumber].date.hijri.month.number - 1]
        } ${monthData[dayNumber].date.hijri.year}</th>
            <th>${monthData[dayNumber].date.gregorian.weekday.en}</th>
            <th>${convert24To12(monthData[dayNumber].timings.Fajr)}</th>
            <th>${convert24To12(monthData[dayNumber].timings.Sunrise)}</th>
            <th>${convert24To12(monthData[dayNumber].timings.Dhuhr)}</th>
            <th>${convert24To12(monthData[dayNumber].timings.Asr)}</th>
            <th>${convert24To12(monthData[dayNumber].timings.Maghrib)}</th>
            <th>${convert24To12(monthData[dayNumber].timings.Isha)}</th>
        </tr>
        `;
    }
  }
  return tableBody;
}

function convert24To12(time) {
  let splitTime = time.substring(0, 5).split(":");
  let hours = +splitTime[0];
  let minutes = splitTime[1];
  let suffix = hours >= 12 ? "PM" : "AM";
  hours = ((hours + 11) % 12) + 1;

  return `${hours}:${minutes}`;
}

createTable(year);

/**
 * API META
 * 
 {
  "latitude": 42.30448296058161,
  "longitude": -83.14320741914071,
  "timezone": "America/Detroit",
  "method": {
    "id": 2,
    "name": "Islamic Society of North America (ISNA)",
    "params": {
      "Fajr": 15,
      "Isha": 15
    },
    "location": {
      "latitude": 39.70421229999999,
      "longitude": -86.39943869999999
    }
  },
  "latitudeAdjustmentMethod": "MIDDLE_OF_THE_NIGHT",
  "midnightMode": "STANDARD",
  "school": "STANDARD",
  "offset": {
    "Imsak": 0,
    "Fajr": 0,
    "Sunrise": 0,
    "Dhuhr": 0,
    "Asr": 0,
    "Maghrib": 0,
    "Sunset": 0,
    "Isha": 0,
    "Midnight": 0
  }
}
 */
