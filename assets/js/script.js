const seatGeekID = "MjY1NDM2MjJ8MTY0OTg3MDg4Ni41Mzg2OTM0";
const seatGeekSec = "dde8a5132043b2b9bb1c3b0b0b5dc13870531280835149307fc9824a7b132267";
const seatGeekAuth = "&client_id=" + seatGeekID + "&client_secret=" + seatGeekSec;
const seatGeekEventUrl = "https://api.seatgeek.com/2/venues?postal_code=";


// lyric info
const apiURL = "https://api.lyrics.ovh/v1/"
var artistEl = document.querySelector("#artistSearch");
var songEl = document.querySelector("#songSearch");
var searchEl = document.querySelector("#searchBtn");
var lyricContainerEl = document.querySelector("#lyricContainer");
var zipCodeEl = document.querySelector("#zip");
var lyricsText = document.querySelector("p");

searchEl.addEventListener("click", search);

function search(){
    // console.log("Click");

    var artist = artistEl.value.trim();
    var song = songEl.value.trim();
    var zipCode = zipCodeEl.value.trim();

fetch(apiURL + artist + "/" + song, {
    method:"GET",
})
    .then(response => response.json().then(function(data){
        displayStuff(data)
    }))

   
    // SeatGeek fetch

    fetch(seatGeekEventUrl +  zipCode + seatGeekAuth)
        .then(response => response.json().then(function(data){
            displayVenue(data)
        }))


        // .then(data => console.log(data.venues[1].name))
};
var displayVenue = function(venues){

    console.log(venues.venues[1].name);
    var eventEl = document.createElement("span");
    eventEl.textContent = venues.venues[1].name;
    lyricContainerEl.appendChild(eventEl);

}

var displayStuff = function(lyrics, venues){
    // console.log(lyrics);
    var lyricEl = document.createElement("span");
    lyricEl.textContent = lyrics.lyrics;
    lyricsText.innerText = lyricEl.textContent;
  
}