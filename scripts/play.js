/*
  Variablar för användning
*/
let pause = 1;
let playing = false;
let playLoop;
let track_time_elapsed = 0;
let currentTrack = 0;
let shuffle = -1;
let repeat = -1;

/*
  Låtlista
*/

let tracks = [
  ["Cannibal Corpse", "Demented Aggression", "194"],
  ["Cannibal Corpse", "Sarcophagic Frenzy", "222"],
  ["Cannibal Corpse", "Scourge of Iron", "284"],
  ["Cannibal Corpse", "Encased in Concrete", "193"],
  ["Cannibal Corpse", "As Deep as the Knife Will Go", "205"],
  ["Cannibal Corpse", "Intestinal Crank", "234"],
  ["Cannibal Corpse", "Followed Home Then Killed", "216"],
  ["Cannibal Corpse", "The Strangulation Chair", "249"],
  ["Cannibal Corpse", "Caged... Contorted", "233"],
  ["Cannibal Corpse", "Crucifier Avenged", "226"],
  ["Cannibal Corpse", "Rabid", "184"],
  ["Cannibal Corpse", "Torn Throug", "191"]
];


/*
  Översätt nuvarande tid på låt till ett värde mellan 0-100
*/

function mapTo() {
  return (100 * (track_time_elapsed / tracks[currentTrack][2]));
}


/*
  Starta spelloopen
  Tickar upp tidsåtgång för spelande låt och uppdaterar varje sekund
  Ändrar även timeline progress
*/

function startLoop() {
  playing = true;
  playLoop = setInterval(function() {
    track_time_elapsed++;

    if (track_time_elapsed > tracks[currentTrack][2]) {
      nextTrack();
    }

    let min = parseInt(track_time_elapsed / 60);
    let sec = parseInt(track_time_elapsed % 60);
    let timeBar = mapTo();
    if (sec < 10) {
      sec = "0" + sec;
    }
    document.getElementById('player_track_time_elapsed_bar').style.width = timeBar + "%";
    document.getElementById('player_track_time_elapsed').innerHTML = "" + min + ":" + sec;
  }, 1000);
}


/*
  Shufflar en låt i spellistan
*/
function doShuffle() {
  return Math.floor(Math.random() * Math.floor(tracks.length));
}


/*
  Väljer en ny låt att spela
  Antingen om användaren spolar eller om låten tar slut
  Olika utfall beroende på repeat och/eller shuffle
*/

function nextTrack(n = 0) {
  if(repeat == 1 && n == 0){
    // Do nothing
  } else if(shuffle == 1){

    let newTrack;
    do{
      newTrack = doShuffle();
    }while(currentTrack == newTrack);

    currentTrack = newTrack;

  } else if(n != 0){

    currentTrack += n;

  } else {
    currentTrack++;
  }

  track_time_elapsed = 0;

  if (currentTrack < tracks.length) {
    document.getElementById('player_artist_name').innerHTML = tracks[currentTrack][0];
    document.getElementById('player_track_name').innerHTML = tracks[currentTrack][1];
    let t_min = parseInt(tracks[currentTrack][2] / 60);
    let t_sec = parseInt(tracks[currentTrack][2] % 60);
    if (t_sec < 10) {
      t_sec = "0" + t_sec;
    }
    document.getElementById('player_track_time_total').innerHTML = "" + t_min + ":" + t_sec;
    document.getElementById('player_track_time_elapsed_bar').style.width = "0%";
  } else {
    currentTrack--;
    play_pause();
  }
}



/*
  Stannar spelloopen
*/
function stopLoop() {
  playing = false;
  clearTimeout(playLoop);
}

/*
  Funktion för att spela eller pausa musik
  Uppdaterar vilken knapp som är synlig och startar / stänger loopen
*/
function play_pause() {
  pause *= -1;
  if (pause == 1) {
    document.getElementById('p_pause').style.display = "none";
    document.getElementById('p_play').style.display = "block";
    stopLoop();
  } else {
    document.getElementById('p_play').style.display = "none";
    document.getElementById('p_pause').style.display = "block";
    startLoop();
  }
}

/*
  Definierar vad som händer när vi trycker på shuffle
*/
function play_shuffle() {
  shuffle *= -1;
  if (shuffle == 1) {
    document.getElementById('p_shuffle').style.color = "#2F2";
  } else {
    document.getElementById('p_shuffle').style.color = "#FFF";
  }
}

/*
  Definierar vad som händer när vi trycker på repeat
*/
function play_repeat() {
  repeat *= -1;
  if (repeat == 1) {
    document.getElementById('p_repeat').style.color = "#2F2";
  } else {
    document.getElementById('p_repeat').style.color = "#FFF";
  }
}


/*
  Funktion för att välja låtar direkt från spellistan
*/
function playTrack(track_id) {
  stopLoop();
  currentTrack = track_id;
  document.getElementById('player_artist_name').innerHTML = tracks[track_id][0];
  document.getElementById('player_track_name').innerHTML = tracks[track_id][1];
  let t_min = parseInt(tracks[track_id][2] / 60);
  let t_sec = parseInt(tracks[track_id][2] % 60);
  if (t_sec < 10) {
    t_sec = "0" + t_sec;
  }
  document.getElementById('player_track_time_total').innerHTML = "" + t_min + ":" + t_sec;
  document.getElementById('player_track_time_elapsed_bar').style.width = "0%";
  if (pause == 1) {
    play_pause();
  } else if (!playing) {
    startLoop();
  }
  track_time_elapsed = 0;
  document.getElementById('player_track_time_elapsed').innerHTML = "0:00";
}
