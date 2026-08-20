/* =========================
   WIMUSIKAL MUSIC ENGINE
========================= */

const tracks = [
  {
    title: "Moment of Peace",
    artist: "Wimusikal Sessions",
    genre: "CHILL / PIANO",
    file: "audio/moment-of-peace.mp3"
  },
  {
    title: "Midnight Bloom",
    artist: "Wimusikal Sessions",
    genre: "LOFI / DREAMY",
    file: "audio/midnight-bloom.mp3"
  },
  {
    title: "Soft Afternoon",
    artist: "Wimusikal Sessions",
    genre: "ACOUSTIC / CHILL",
    file: "audio/soft-afternoon.mp3"
  },
  {
    title: "Good Energy",
    artist: "Wimusikal Sessions",
    genre: "UPBEAT / POP",
    file: "audio/good-energy.mp3"
  }
];


let currentTrack = 0;
let isPlaying = false;
let shuffle = false;

const audio = new Audio();

audio.preload = "metadata";
audio.volume = .5;


/* ELEMENTS */

const mainPlay = document.getElementById("mainPlay");
const heroPlay = document.getElementById("heroPlay");
const miniPlay = document.getElementById("miniPlay");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerGenre = document.getElementById("playerGenre");

const heroTitle = document.getElementById("heroTitle");
const heroArtist = document.getElementById("heroArtist");

const miniTitle = document.getElementById("miniTitle");
const miniStatus = document.getElementById("miniStatus");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const songCards = document.querySelectorAll(".song-card");
const songButtons = document.querySelectorAll(".song-play");


/* LOAD TRACK */

function loadTrack(index){

  currentTrack = index;

  const track = tracks[currentTrack];

  audio.src = track.file;

  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;
  playerGenre.textContent = track.genre;

  heroTitle.textContent = track.title;
  heroArtist.textContent = track.artist;

  miniTitle.textContent = track.title;
  miniStatus.textContent = "Ready to play";

  progress.value = 0;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";

  songCards.forEach(card => {
    card.classList.remove("active");
  });

  if(songCards[currentTrack]){
    songCards[currentTrack].classList.add("active");
  }

}


/* PLAY */

function playTrack(){

  audio.play()
    .then(() => {

      isPlaying = true;

      updateButtons();

      miniStatus.textContent = "Now playing";

    })
    .catch(() => {

      miniStatus.textContent =
        "Tambahkan file MP3 ke folder audio/";

    });

}


/* PAUSE */

function pauseTrack(){

  audio.pause();

  isPlaying = false;

  updateButtons();

  miniStatus.textContent = "Paused";

}


/* TOGGLE */

function togglePlay(){

  if(isPlaying){
    pauseTrack();
  }else{
    playTrack();
  }

}


/* BUTTON UI */

function updateButtons(){

  const icon = isPlaying ? "❚❚" : "▶";

  mainPlay.textContent = icon;
  heroPlay.textContent = icon;
  miniPlay.textContent = icon;

  songButtons.forEach((button,index)=>{

    button.textContent =
      index === currentTrack && isPlaying
      ? "❚❚"
      : "▶";

  });

}


/* SONG CARD */

songButtons.forEach((button,index)=>{

  button.addEventListener("click",()=>{

    if(currentTrack === index && isPlaying){

      pauseTrack();

    }else{

      loadTrack(index);
      playTrack();

    }

  });

});


/* PLAYER BUTTONS */

mainPlay.addEventListener("click",togglePlay);
heroPlay.addEventListener("click",togglePlay);
miniPlay.addEventListener("click",togglePlay);


/* NEXT */

document.getElementById("next").addEventListener("click",nextTrack);

function nextTrack(){

  if(shuffle){

    let next;

    do{
      next = Math.floor(Math.random()*tracks.length);
    }
    while(next === currentTrack && tracks.length > 1);

    loadTrack(next);

  }else{

    currentTrack =
      (currentTrack + 1) % tracks.length;

    loadTrack(currentTrack);

  }

  playTrack();

}


/* PREVIOUS */

document.getElementById("prev").addEventListener("click",()=>{

  currentTrack =
    (currentTrack - 1 + tracks.length)
    % tracks.length;

  loadTrack(currentTrack);

  playTrack();

});


/* AUTO NEXT */

audio.addEventListener("ended",()=>{

  nextTrack();

});


/* PROGRESS */

audio.addEventListener("timeupdate",()=>{

  if(!audio.duration) return;

  progress.value =
    (audio.currentTime / audio.duration) * 100;

  currentTime.textContent =
    formatTime(audio.currentTime);

});


audio.addEventListener("loadedmetadata",()=>{

  duration.textContent =
    formatTime(audio.duration);

});


progress.addEventListener("input",()=>{

  if(!audio.duration) return;

  audio.currentTime =
    (progress.value / 100) * audio.duration;

});


/* VOLUME */

volume.addEventListener("input",()=>{

  audio.volume = volume.value;

});


/* SHUFFLE */

document.getElementById("shuffle").addEventListener("click",function(){

  shuffle = !shuffle;

  this.classList.toggle("enabled",shuffle);

});


/* REPEAT */

let repeat = false;

document.getElementById("repeat").addEventListener("click",function(){

  repeat = !repeat;

  this.classList.toggle("enabled",repeat);

});


audio.addEventListener("ended",()=>{

  if(repeat){

    audio.currentTime = 0;
    playTrack();

  }

});


/* TIME */

function formatTime(seconds){

  if(!seconds || isNaN(seconds)){
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const secs =
    Math.floor(seconds % 60)
    .toString()
    .padStart(2,"0");

  return `${minutes}:${secs}`;

}


/* SEARCH */

const searchInput =
  document.getElementById("searchInput");

searchInput.addEventListener("input",function(){

  const query =
    this.value.toLowerCase().trim();

  songCards.forEach(card=>{

    const text =
      card.textContent.toLowerCase();

    card.style.display =
      text.includes(query)
      ? ""
      : "none";

  });

});


/* SURPRISE ME */

document.getElementById("surpriseBtn")
  .addEventListener("click",()=>{

    const random =
      Math.floor(Math.random()*tracks.length);

    loadTrack(random);

    playTrack();

    document
      .getElementById("listen")
      .scrollIntoView({
        behavior:"smooth"
      });

  });


/* CTA */

document.getElementById("ctaPlay")
  .addEventListener("click",()=>{

    if(!isPlaying){
      playTrack();
    }

    document
      .getElementById("listen")
      .scrollIntoView({
        behavior:"smooth"
      });

  });


/* NAVBAR */

const navbar =
  document.querySelector(".navbar");

window.addEventListener("scroll",()=>{

  navbar.classList.toggle(
    "scrolled",
    window.scrollY > 20
  );

});


/* REVEAL */

const observer =
  new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

      if(entry.isIntersecting){

        entry.target.classList.add("show");

        observer.unobserve(entry.target);

      }

    });

  },{
    threshold:.12
  });


document
  .querySelectorAll(".reveal")
  .forEach(element=>observer.observe(element));


/* AUTO SCROLL COLLECTION */

const songScroller =
  document.getElementById("songList");

let autoScroll = true;

setInterval(()=>{

  if(!autoScroll) return;

  if(window.innerWidth < 700) return;

  const maxScroll =
    songScroller.scrollWidth -
    songScroller.clientWidth;

  if(songScroller.scrollLeft >= maxScroll - 5){

    songScroller.scrollTo({
      left:0,
      behavior:"smooth"
    });

  }else{

    songScroller.scrollBy({
      left:310,
      behavior:"smooth"
    });

  }

},4000);


/* STOP AUTO SCROLL WHEN USER INTERACTS */

songScroller.addEventListener("mouseenter",()=>{
  autoScroll = false;
});

songScroller.addEventListener("mouseleave",()=>{
  autoScroll = true;
});


/* LANGUAGE */

let english = false;

document.getElementById("langBtn")
  .addEventListener("click",()=>{

    english = !english;

    if(english){

      document.querySelector(".hero h1").innerHTML =
        `Music for every<br><em>version</em> of you.`;

      document.querySelector(".hero-content>p:not(.eyebrow)")
        .textContent =
        "Find songs, moods and sounds that match every version of yourself.";

      document.getElementById("searchInput").placeholder =
        "Search songs, artists, genres...";

    }else{

      document.querySelector(".hero h1").innerHTML =
        `Music for every<br><em>version</em> of you.`;

      document.querySelector(".hero-content>p:not(.eyebrow)")
        .textContent =
        "Temukan lagu, mood, genre, dan cerita yang cocok dengan setiap versi dirimu.";

      document.getElementById("searchInput").placeholder =
        "Search songs, artists, genres...";

    }

  });


/* INITIAL */

loadTrack(0);
updateButtons();
