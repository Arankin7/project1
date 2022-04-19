const seatGeekID = "MjY1NDM2MjJ8MTY0OTg3MDg4Ni41Mzg2OTM0";
const seatGeekSec = "dde8a5132043b2b9bb1c3b0b0b5dc13870531280835149307fc9824a7b132267";
const seatGeekAuth = "&client_id=" + seatGeekID + "&client_secret=" + seatGeekSec;
const seatGeekEventUrl = "https://api.seatgeek.com/2/venues?postal_code=";
const seatGeekPerformerUrl = "https://api.seatgeek.com/2/performers?slug=";
const seatGeekRecUrl = "https://api.seatgeek.com/2/recommendations/performers?performers.id=";
const seatGeekEventByCityUrl = "https://api.seatgeek.com/2/events?venue.city="


// lyric info
const apiURL = "https://api.lyrics.ovh/v1/"
var artistEl = document.querySelector("#artistSearch");
var songEl = document.querySelector("#songSearch");
var lyricSearchEl = document.querySelector("#lyricSearchBtn");
var lyricContainerEl = document.querySelector("#lyricContainer");
var zipCodeEl = document.querySelector("#zip");
var venueSearchEl = document.querySelector("#venueSearchBtn");
var venueListEl = document.querySelector("#venueContainer");
var recSearchEl = document.querySelector("#recSearchBtn");
var recListEl = document.querySelector("#recContainer");
var artistRecEl = document.querySelector("#artistRec");

const eventSearchBtnEl = document.getElementById("eventSearchBtn");
const eventCityEl = document.getElementById("city");
const eventContainerEl = document.getElementById("eventContainer")

recSearchEl.addEventListener("click", artistRecSearch)
lyricSearchEl.addEventListener("click", lyricSearch);
venueSearchEl.addEventListener("click", venueSearch);
eventSearchBtnEl.addEventListener("click", eventSearch);


function lyricSearch(){
    // console.log("Click");

    var artist = artistEl.value.trim();
    var song = songEl.value.trim();
    

fetch(apiURL + artist + "/" + song, {
    method:"GET",
})
    .then(response => response.json().then(function(data){
        displayLyrics(data)
    })) 
};

// SeatGeek fetch
function venueSearch(){
    var zipCode = zipCodeEl.value.trim();
    fetch(seatGeekEventUrl +  zipCode + seatGeekAuth)
        .then(response => response.json().then(function(data){
            displayVenue(data)
        }))
        // .then(data => console.log(data.venues[1].name))
}

// Recommendation Search
function artistRecSearch(){
    var artist = artistRecEl.value.trim();

    fetch(seatGeekPerformerUrl + artist + seatGeekAuth)
        .then(response => response.json().then(function(data){
            console.log(data)
            var artistId = (data.performers[0].id)
            fetch(seatGeekRecUrl + artistId + seatGeekAuth)
            .then(response => response.json().then(function(data){
            displayRec(data)
        }))
        }))
}

var displayRec = function(recommendations){
    recListEl.textContent = "";
    console.log(recommendations.recommendations);

    // Starts at index 3, displays 3 recommendations
    for(var i = 3; i < 6; i++){
        // console.log(recommendations.recommendations[i])

        var recEl = document.createElement("li");
        var recUrlEl = document.createElement("a");
        recUrlEl.classList = "urlLink";
        recUrlEl.href = recommendations.recommendations[i].performer.url;
        recUrlEl.innerHTML = recommendations.recommendations[i].performer.name;

        recListEl.appendChild(recEl);
        recListEl.appendChild(recUrlEl);
    }
}


var displayVenue = function(venues){

    // clears out venue list before appending new list
    venueListEl.textContent = "";

    // displays 5 closeby venues

    for(var i = 0; i < 5; i++){
        // console.log(venues.venues[i].url);

        var venueEl = document.createElement("li");
        var venueUrlEl = document.createElement("a");
        venueUrlEl.classList = "urlLink";
        venueUrlEl.href = venues.venues[i].url;
        venueUrlEl.innerHTML = venues.venues[i].name;
        // venueEl.innerHTML =((venues.venues[i].name) + " URL: " + (venues.venues[i].url));
        venueListEl.appendChild(venueEl);
        venueListEl.appendChild(venueUrlEl);
    }
}

var displayLyrics = function(lyrics){

    // clears out lyrics before appending new lyrics
    lyricContainerEl.textContent = "";

    // displays lyrics of searched song
    console.log(lyrics);
    var lyricEl = document.createElement("span");
    lyricEl.innerHTML = lyrics.lyrics;
    lyricContainerEl.appendChild(lyricEl);
}

function eventSearch() {
    const city = eventCityEl.value.trim();

    if (!city) {
        console.log("No venue");
    } else {
        eventCityEl.value = "";
        fetch(seatGeekEventByCityUrl + city + seatGeekAuth).then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    displayEvents(data.events);
                })
            }
        })
    }
}

function displayEvents(events) {
    eventContainerEl.textContent = "";
    // ul el
    const eventUlEl = document.createElement("ul")
    eventUlEl.className = "pure-menu-list";

    for(let i=0; i<events.length; i++) {
        if(events[i].type == "concert") {
            // console.log(events[i]);

            // create list elements
            const eventListItem = document.createElement("li");
            eventListItem.className = "pure-menu-item";

            const eventLinkEl = document.createElement("a");
            eventLinkEl.className = "pure-menu-link";
            eventLinkEl.href = events[i].url;
            eventLinkEl.textContent = events[i].short_title;
            eventLinkEl.setAttribute("target", "_blank")
            eventListItem.appendChild(eventLinkEl);

            eventUlEl.appendChild(eventListItem);

        }
    }
    eventContainerEl.appendChild(eventUlEl);
}