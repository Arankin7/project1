const seatGeekID = "MjY1NDM2MjJ8MTY0OTg3MDg4Ni41Mzg2OTM0";
const seatGeekSec = "dde8a5132043b2b9bb1c3b0b0b5dc13870531280835149307fc9824a7b132267";
const seatGeekAuth = "&client_id=" + seatGeekID + "&client_secret=" + seatGeekSec;
const seatGeekEventUrl = "https://api.seatgeek.com/2/venues?postal_code=";


// lyric info
const apiURL = "https://api.lyrics.ovh/v1/"
var artistEl = document.querySelector("#artistSearch");
var songEl = document.querySelector("#songSearch");
var lyricSearchEl = document.querySelector("#lyricSearchBtn");
var lyricContainerEl = document.querySelector("#lyricContainer");
var zipCodeEl = document.querySelector("#zip");
var venueSearchEl = document.querySelector("#venueSearchBtn");
var venueListEl = document.querySelector("#venueContainer");
var lyricsText = document.querySelector("p");

lyricSearchEl.addEventListener("click", lyricSearch);
venueSearchEl.addEventListener("click", venueSearch);

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


var displayVenue = function(venues){

    // displays 5 closeby venues

    for(var i = 0; i < 5; i++){
        console.log(venues.venues[i]);
        var venueEl = document.createElement("li");
        venueEl.innerHTML = venues.venues[i].name;
        venueListEl.appendChild(venueEl);
    }
}

var displayLyrics = function(lyrics){
    // console.log(lyrics);
    var lyricEl = document.createElement("span");
    lyricEl.textContent = lyrics.lyrics;
    lyricsText.innerText = lyricEl.textContent;
  
}