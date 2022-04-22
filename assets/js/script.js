let searchHistory = JSON.parse(localStorage.getItem("music-search-history"));

if(!searchHistory) {
    searchHistory = {
        "lyrics": [],
        "venues": [],
        "recommendations": [],
        "events": []
    }
}

const seatGeekID = "MjY1NDM2MjJ8MTY0OTg3MDg4Ni41Mzg2OTM0";
const seatGeekSec = "dde8a5132043b2b9bb1c3b0b0b5dc13870531280835149307fc9824a7b132267";
const seatGeekAuth = "&client_id=" + seatGeekID + "&client_secret=" + seatGeekSec;
const seatGeekEventUrl = "https://api.seatgeek.com/2/venues?postal_code=";
const seatGeekPerformerUrl = "https://api.seatgeek.com/2/performers?q=";
const seatGeekRecUrl = "https://api.seatgeek.com/2/recommendations/performers?performers.id=";
const seatGeekEventByCityUrl = "https://api.seatgeek.com/2/events?venue.city="


// lyric info
const apiURL = "https://api.lyrics.ovh/v1/"
var artistEl = document.querySelector("#artistSearch");
var songEl = document.querySelector("#songSearch");
var lyricSearchEl = document.querySelector("#lyricSearchBtn");
var lyricContainerEl = document.querySelector("#lyricsContainer");
var zipCodeEl = document.querySelector("#zip");
var venueSearchEl = document.querySelector("#venueSearchBtn");
var venueListEl = document.querySelector("#venueContainer");
var recSearchEl = document.querySelector("#recSearchBtn");
var recListEl = document.querySelector("#recContainer");
var artistRecEl = document.querySelector("#artistRec");
const mainContentEl = document.getElementById("main-content");


const eventSearchBtnEl = document.getElementById("eventSearchBtn");
const eventCityEl = document.getElementById("city");
const eventContainerEl = document.getElementById("eventContainer")

var errText = document.createElement("span");
errText.textContent = "Sorry, there was a problem with your search.  Please try again.";

const lyricHistoryContainerEl = document.getElementById("lyricHistoryContainer");
const venueHistoryContainerEl = document.getElementById("venueHistoryContainer");
const recommendationHistoryContainerEl = document.getElementById("recommendationHistoryContainer");
const eventsHistoryContainerEl = document.getElementById("eventsHistoryContainer");


recSearchEl.addEventListener("click", artistRecSearch)
lyricSearchEl.addEventListener("click", lyricSearch);
venueSearchEl.addEventListener("click", venueSearch);
eventSearchBtnEl.addEventListener("click", eventSearch);


function lyricSearch(){
    // console.log("Click");

    var artist = artistEl.value.trim();
    var song = songEl.value.trim();
    
    if(artist && song){
        fetch(apiURL + artist + "/" + song, {
            method:"GET",
        })
            .then(response => response.json().then(function(data){
                if(response.ok){
                    displayLyrics(data)
                    var check = true;
                    for (i = 0; i < searchHistory.lyrics.length; i++) {
                        console.log(searchHistory.lyrics[i]);
                        if (searchHistory.lyrics[i].artist == artist && searchHistory.lyrics[i].song == song){
                            check = false;
                            break;
                        }
                        else{
                            console.log("false");
                        }
                    }
                    if (check){
                        searchHistory.lyrics.push({"artist": artist, "song": song})
                        saveHistory();
                        displayHistory();
                    }
                }
                else{
                    lyricContainerEl.appendChild(errText);
                }
            })) 
    }
    else if (!artist || !song){
        var errEmpty = document.createElement("span");
        errEmpty.textContent = "Please make sure to fill out all required fields.";
        lyricContainerEl.appendChild(errEmpty);
    }
    
};

// SeatGeek fetch
function venueSearch(){
    var zipCode = zipCodeEl.value.trim();
    fetch(seatGeekEventUrl +  zipCode + seatGeekAuth)
        .then(response => response.json().then(function(data){
            if(response.ok){
                if (!searchHistory.venues.includes(zipCode)){
                    searchHistory.venues.push(zipCode);
                    saveHistory();
                    displayHistory();
                }
             displayVenue(data);
            //  searchHistory.venues.push(zipCode);
            //  saveHistory();
            }
            else{
                venueListEl.appendChild(errText);
            }
        }))
}

// Recommendation Search
function artistRecSearch(){
    var artist = artistRecEl.value.trim();
    
    console.log(artist);

    fetch(seatGeekPerformerUrl + artist + seatGeekAuth)
        .then(response => response.json().then(function(data){
            var artistId = (data.performers[0].id)
            if(response.ok && artistId){
                console.log(data)
                fetch(seatGeekRecUrl + artistId + seatGeekAuth)
                .then(response => response.json().then(function(data){
                displayRec(data);
                if (!searchHistory.recommendations.includes(artist)){
                    searchHistory.recommendations.push(artist);
                    saveHistory();
                    displayHistory();
                }
                }));
            }
            else if (!response.ok || !artistId){
                recListEl.appendChild(errText);
            }
        }));
}

//checks to make sure duplicate items don't get added to the users history
//doesn't work on lyricSearch()
// function duplicateCheck(history, check){
//     bool = true;
//     for (i = 0; i < history.length; i++) {
//         console.log(history[i]);
//         if (history[i] == check){
//             bool = false;
//             break;
//         }
//         else{
//             console.log("false");
//         }
//     }
//     if (bool){
//         return true;
//     }
//     else{
//         return false;
//     }
// }

var displayRec = function(recommendations){
    recListEl.textContent = "";
    console.log(recommendations.recommendations);

    for(var i = 0; i < 5; i++){
        if(recommendations.recommendations[i].performer.type == "band"){
            console.log(recommendations.recommendations[i].performer.type);
            // console.log(recommendations.recommendations[i]);

            var recEl = document.createElement("li");
            var recUrlEl = document.createElement("a");
            recUrlEl.classList = "urlLink";
            recUrlEl.href = recommendations.recommendations[i].performer.url;
            recUrlEl.innerHTML = recommendations.recommendations[i].performer.name;

            recListEl.appendChild(recEl);
            recListEl.appendChild(recUrlEl);
        }        
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
    console.log(lyrics.lyrics);
    var lyricEl = document.createElement("span");
    lyricEl.innerText = lyrics.lyrics;
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
                    if (!searchHistory.events.includes(city)) {
                        searchHistory.events.push(city);
                        saveHistory();
                        displayHistory();
                    }
                    
                   
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

function saveHistory() {
    localStorage.setItem("music-search-history", JSON.stringify(searchHistory));
}

function displayHistory() {
    const lyricHistory = searchHistory.lyrics;
    const venueHistory = searchHistory.venues;
    const recommendationHistory = searchHistory.recommendations;
    const eventHistory = searchHistory.events;

    if(lyricHistory.length > 0) {
        lyricHistoryContainerEl.innerHTML = "";

        const historyHeader = document.createElement("h4");
        historyHeader.textContent = "Search History:";
        lyricHistoryContainerEl.appendChild(historyHeader);

        for(let i=0; i<lyricHistory.length; i++) {
            const historyBtn = document.createElement("button");
            historyBtn.className = "pure-button button-secondary lyrics";
            historyBtn.textContent = `${lyricHistory[i].song} by ${lyricHistory[i].artist}`;
            lyricHistoryContainerEl.appendChild(historyBtn);
        }
    }

    if(venueHistory.length > 0) {
        venueHistoryContainerEl.innerText = "";

        const historyHeader = document.createElement("h4");
        historyHeader.textContent = "Search History:";
        venueHistoryContainerEl.appendChild(historyHeader);

        for(let i=0; i<venueHistory.length; i++) {
            const historyBtn = document.createElement("button");
            historyBtn.className = "pure-button button-secondary venues";
            historyBtn.textContent = venueHistory[i];
            venueHistoryContainerEl.appendChild(historyBtn);
        }
    }

    if(recommendationHistory.length > 0) {
        recommendationHistoryContainerEl.innerText = "";
        const historyHeader = document.createElement("h4");
        historyHeader.textContent = "Search History:";
        recommendationHistoryContainerEl.appendChild(historyHeader);

        for(let i=0; i<recommendationHistory.length; i++) {
            const historyBtn = document.createElement("button");
            historyBtn.className = "pure-button button-secondary recommendations";
            historyBtn.textContent = recommendationHistory[i];
            recommendationHistoryContainerEl.appendChild(historyBtn);
        }
    }

    if(eventHistory.length > 0) {
        eventsHistoryContainerEl.innerText = "";

        const historyHeader = document.createElement("h4");
        historyHeader.textContent = "Search History:";
        eventsHistoryContainerEl.appendChild(historyHeader);

        for(let i=0; i<eventHistory.length; i++) {
            const historyBtn = document.createElement("button");
            historyBtn.className = "pure-button button-secondary events";
            historyBtn.textContent = eventHistory[i];
            eventsHistoryContainerEl.appendChild(historyBtn);
        }
    }
}

function searchHistoryBtnHandler(e) {
    if(e.target.matches(".lyrics")) {
        btnText = e.target.textContent.split("by");
        artistEl.value = btnText[1].trim();
        songEl.value = btnText[0].trim();
    }
    else if(e.target.matches(".venues")) {
        zipCodeEl.value = e.target.textContent;
    }
    else if(e.target.matches(".recommendations")) {
        artistRecEl.value = e.target.textContent;
    }
    else if(e.target.matches(".events")) {
        eventCityEl.value = e.target.textContent;
    }
}

mainContentEl.addEventListener("click", searchHistoryBtnHandler);

displayHistory();