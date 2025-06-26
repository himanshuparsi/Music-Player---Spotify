console.log("JavaScript");
let currSong = new Audio();
let songs;
let currFolder;

function secondsToMinSec(seconds) {
  // Ensure the input is a number
  seconds = parseInt(seconds, 10);

  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad minutes and seconds with leading zeros if necessary
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  // Return the formatted string
  return `${paddedMinutes}:${paddedSeconds}`;
}

// Example usage:
// console.log(secondsToMinSec(77)); // Output: "01:17"
// console.log(secondsToMinSec(125)); // Output: "02:05"
// console.log(secondsToMinSec(3600)); // Output: "60:00"

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1].split("%")[0]);
    }
  }

  //Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    let a = await fetch(`songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");



      // for (const anchor of anchors) {
      //   console.log(anchor);
        
      //   let folderArt = anchor.href.split("/").slice(-2)[0]; // Get the meta data of the folder
      // console.log(folderArt);
      

      // let aArt = await fetch(`songs/${folderArt}/info.json`);
      // // let responseArt =  await aArt.json();
      // console.log(aArt);
      
      // }
    
    


    Array.from(anchors).forEach(async (e) => {
      // console.log(e);
      
      let folderArt = e.href.split("/").slice(-2)[0]; // Get the meta data of the folder
      // console.log(folderArt);

      // console.log(`songs/${folderArt.toString()}/info.json`);
      
      

      let aArt = await fetch(`songs/${folderArt.toString()}/info.json`);
      let responseArt =  await aArt.json();
      console.log( "response : " +  responseArt);
      

      // Build the HTML content
      let songContent = `
            <li>
                <img class="invert" src="img/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>${responseArt.artist}</div>
                </div>
                <div class="playNow">
                    <span>Play Now</span>
                    <img class="invert" src="img/play.svg" alt="">
                </div>
            </li>
        `;
      window.songContent = songContent;
    });
    // Instead of repeatedly updating the innerHTML, store it and update once
    songUL.innerHTML += window.songContent;
  }

  //Attach an event listner to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  currSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = " 00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];
      // console.log(`folder of displayAlbum : ${folder}`);

      //Get the meta data of the folder
      let a = await fetch(`songs/${folder}/info.json`);
      let response = await a.json();
      // console.log(response);
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                >
                  <path
                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                    stroke="black"
                    stroke-width="1.5"
                    fill="#000"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <img
                src="/songs/${folder}/cover.jpg"
                alt=""
              />
              <h2>${response.tittle}</h2>
              <p>${response.description}</p>
            </div>`;
    }
  }

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    // console.log(e);
    e.addEventListener("click", async (item) => {
      // console.log(item.currentTarget.dataset);
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
  // console.log(anchors);
}

async function main() {
  //get list of all song
  await getSongs("songs/emiway");
  playMusic(songs[0], true);
  // console.log(songs);

  //Display all the albums on the page
  displayAlbums();

  //Attach an event listner to play next & previous
  let play = document.getElementById("play");
  let previous = document.getElementById("previous");
  let next = document.getElementById("next");
  play.addEventListener("click", () => {
    if (currSong.paused) {
      currSong.play();
      play.src = "img/pause.svg";
    } else {
      currSong.pause();
      play.src = "img/play.svg";
    }
  });

  //Listen for time update event
  currSong.addEventListener("timeupdate", () => {
    // console.log(currSong.currentTime, currSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinSec(
      currSong.currentTime
    )} / ${secondsToMinSec(currSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currSong.currentTime / currSong.duration) * 100 + "%";
  });

  //Add an eventListner to seek baar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currSong.currentTime = (currSong.duration * percent) / 100;
  });

  //Add an event listner for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Add an event listner for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-1200%";
  });

  //Add an event listner to previous
  previous.addEventListener("click", () => {
    // console.log("Previous");

    let index = songs.indexOf(currSong.src.split("/songs/")[1]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //Add an event listner to next
  next.addEventListener("click", () => {
    // console.log("Next");

    let index = songs.indexOf(currSong.src.split("/songs/")[1]);
    if (index + 1 <= songs.length - 1) {
      playMusic(songs[index + 1]);
    }
  });

  // Add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to ", e.target.value, "/ 100");
      currSong.volume = parseInt(e.target.value) / 100;
    });

  //Add event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currSong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}

main();
