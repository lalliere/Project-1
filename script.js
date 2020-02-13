/* 
Travis: 18750a86e1be4adb85fb042628761fbc

*/
$(function() {
  createList();
  M.AutoInit();
});

const select = $("#state");
const input = $("#city");
const form = $("#form");
const weatherdiv = $("#weatherData");
const fooddiv = $("#foodData");
const trailUl = $("#trailData");
const states = [
  "Alaska",
  "Alabama",
  "Arkansas",
  "Arizona",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Iowa",
  "Idaho",
  "Illinois",
  "Indiana",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Massachusetts",
  "Maryland",
  "Maine",
  "Michigan",
  "Minnesota",
  "Missouri",
  "Mississippi",
  "Montana",
  "North Carolina",
  "North Dakota",
  "Nebraska",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "Nevada",
  "New York",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Virginia",
  "Virgin Islands",
  "Vermont",
  "Washington",
  "Wisconsin",
  "West Virginia",
  "Wyoming"
];
var listfoods = [];

//--------------------------------------------------add food to DOM-----------------------------------------
/*
this gets called to show food food just needs id of click trail
as long as trail id is related to where the food list index
*/
function showFood(el) {
  let list = listfoods[el];
  for (let i = 0; i < list.length; i++) {
    let food = $("#foodData");
    let card = $("<div>");
    let content = $("<div>");
    let action = $("<div>");
    let span = $("<span>");
    let p = $("<p>");
    let a = $("<a>");
    span.attr("clas", "card-title");
    card.attr("class", "card blue-grey darken-1");
    content.attr("class", "card-content white-text");
    action.attr("class", "card-action");
    span.text(list[i].name);
    a.text(list[i].name);
    a.attr("href", list[i].url);
    p.text(`cuisine: ${list[i].food}  
    rating: ${list[i].rating} votes: ${list[i].votes} 
    user rating text: ${list[i].text}
    address: ${list[i].address}
    `);
    content.append(span).append(p);
    action.append(a);
    card.append(content).append(action);
    food.append(card);
  }
}
/*
call this to get food list if you want or use the gloabl var listfood 
*/
function getFood(lat, lon) {
  let settings = {
    async: true,
    crossDomain: true,
    url: `https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lon}`,
    method: "GET",
    headers: {
      "user-key": "d72c48da91ca5b7172d76a664b41aeb0",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  let list = [];
  //d72c48da91ca5b7172d76a664b41aeb0 zamoto
  //https://developers.zomato.com/api/v2.1/geocode?lat=43.0678016&lon=-70.7764224
  $.get(settings, function({ nearby_restaurants }) {
    let food = nearby_restaurants;
    for (let i = 0; i < food.length; i++) {
      let { restaurant } = food[i];
      let cur = {
        name: restaurant.name,
        url: restaurant.url,
        food: restaurant.cuisines,
        address: restaurant.location.address,
        rating: restaurant.user_rating.aggregate_rating,
        text: restaurant.user_rating.rating_text,
        votes: restaurant.user_rating.votes
      };

      list.push(cur);
    }
  });
  listfoods.push(list);
  //return list;
}

function addToHtml(list) {
  for (let i = 0; i < list.length; i++) {
    let foodButton = $("<a>");
    let li = $("<li>");
    let h4 = $("<h4>");
    let a = $("<a>");
    let header = $("<div>");
    let body = $("<div>");
    let trailsummary = $("<p>");
    let trailinfo = $("<p>");
    foodButton.attr("class", "waves-effect waves-light btn");
    header.attr("class", "collapsible-header");
    body.attr("class", "collapsible-body");
    h4.text(list[i].name);
    header.append(h4);
    a.attr("href", list[i].url);
    a.text("Trail link");
    foodButton.attr("onclick", "showFood(this.id)");
    foodButton.attr("id", i);
    foodButton.attr("href", "#!");
    foodButton.text("Nearby Restaurants");

    trailinfo.text(`trail difficulty: ${list[i].difficulty} 
       trail rating: ${list[i].stars}
       trail location: ${list[i].location}`);
    trailsummary.text(list[i].summary);
    body
      .append(trailsummary)
      .append(trailinfo)
      .append(a)
      .append(foodButton);

    li.append(header).append(body);
    trailUl.append(li);
    // localStorage.setItem("foods", JSON.stringify(list[i].food));
  }
}

function getTrails(lat, long) {
  // console.log(`lat: ${lat} long: ${long}`);

  let trailList = [];

  //d72c48da91ca5b7172d76a664b41aeb0 zamoto
  //https://developers.zomato.com/api/v2.1/geocode?lat=43.0678016&lon=-70.7764224
  $.get(
    `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=10&key=200681842-da90e5231d773b9b92835e9dc121c36e`,
    function({ trails }) {
      //longitude: -118.7342
      // latitude: 36.5966
      for (let i = 0; i < trails.length; i++) {
        let cur = trails[i];
        let lt = cur.latitude;
        let ln = cur.longitude;
        let foods = getFood(lt, ln);
        // localStorage.setItem(`${i}`, JSON.stringify(foods));
        /*
                console.group();
                console.log(foods);
                console.log(foods[0]);
                console.log(foods.length);
                console.groupEnd();
                */
        let trail = {
          name: cur.name,
          summary: cur.summary,
          url: cur.url,
          difficulty: cur.difficulty,
          stars: cur.stars,
          location: cur.location,
          food: foods
        };

        trailList.push(trail);
      }
      addToHtml(trailList);
    }
  );
}

function createList() {
  let start = $("option");
  start.text("choose State");
  start.val("");

  select.append(start);

  for (let i = 0; i < states.length; i++) {
    select.append(`<option value="${states[i]}"> 
                 ${states[i]} 
            </option>`);
  }
}

$("#city").keyup(function(event) {
  if (event.keyCode == 13) {
    $("#submit").click();
  }
});
form.on("submit", function(e) {
  e.preventDefault();
  if (listfoods.length > 0) {
    listfoods = [];
    fooddiv.empty();
    trailUl.empty();
  }

  let sel = select.val();
  let str = input.val();
  let city = encodeURI(str);
  select.val("");
  input.val("");
  // https://developers.zomato.com/api/v2.1/locations?query=Portsmouth%2C%20NH
  let setting = {
    async: true,
    crossDomain: true,
    url: `https://developers.zomato.com/api/v2.1/locations?query=${city}%2C%2${sel}`,
    method: "GET",
    headers: {
      "user-key": "d72c48da91ca5b7172d76a664b41aeb0",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  $.get(setting, function({ location_suggestions }) {
    let lat = location_suggestions[0].latitude;
    let lon = location_suggestions[0].longitude;
    getTrails(lat, lon);
  });
});

var x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;

  const Http = new XMLHttpRequest();
  // const url='https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200681842-da90e5231d773b9b92835e9dc121c36e';
  const url =
    "https://www.hikingproject.com/data/get-trails?lat=" +
    lat +
    "&lon=" +
    lon +
    "&maxDistance=10&key=200681842-da90e5231d773b9b92835e9dc121c36e";
  // alert(url);
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = e => {
    // var trail = Http.responseText;

    var trails = JSON.parse(Http.responseText);
    var arrS = trails["success"];

    var arr = trails["trails"];
    console.log(arr.length);

    // alert(arr.length);
    if (arrS == "1" && arr.length > 0) {
      var col = [];
      for (var i = 0; i < arr.length; i++) {
        for (var key in arr[i]) {
          if (col.indexOf(key) === -1) {
            col.push(key);
          }
        }
      }

      var table = document.createElement("table");

      var tr = table.insertRow(-1);

      for (var i = 0; i < 9; i++) {
        if (col[i] != "id") {
          var th = document.createElement("th");
          th.innerHTML = col[i].toUpperCase();
          tr.appendChild(th);
        }
      }

      for (var i = 0; i < arr.length; i++) {
        tr = table.insertRow(-1);

        for (var j = 0; j < 9; j++) {
          if (col[j] != "id") {
            var tabCell = tr.insertCell(-1);
            if (col[j] == "url") {
              tabCell.innerHTML =
                '<a href="' +
                arr[i][col[j]] +
                '" target="_blank">' +
                arr[i][col[j]] +
                "";
            } else {
              tabCell.innerHTML = arr[i][col[j]];
            }
          }
        }
      }

      var divContainer = document.getElementById("showData");
      divContainer.innerHTML = "";
      divContainer.appendChild(table);
    } else {
      alert("No data for this location.");
    }
  };
}