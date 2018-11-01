/*
TODO:

*/


/*
  Variablar för användning
*/
let pause = 1;
let playing = false;
let playLoop;
let track_time_elapsed = 0;
let currentTrack = 0;
let currentPlaylist = 0;
let shuffle = -1;
let repeat = -1;
let view = -1;

/*
  Master DOM
*/
let audio_player;
let audio_track;

/*
  Uppdaterar timeline när användaren trycker på den.
  Ändrar width på inre timeline och tid på track.
*/


function timeControl(event) {
  let time_line = document.getElementById('player_track_time_elapsed_bar');
  let off = document.getElementById('player_track_time_bar');
  let posX = event.clientX;
  let barPosition = Math.floor(posX - off.offsetLeft);


  barPosition = mapTo(barPosition, off.offsetWidth)+1;
  if(barPosition < 2){
    barPosition = 0;
  }


  track_time_elapsed = (barPosition / 100) * tracks[currentPlaylist][currentTrack][2];
  let min = parseInt(track_time_elapsed / 60);
  let sec = parseInt(track_time_elapsed % 60);
  if(sec < 10){
    sec = "0"+sec;
  }

  time_line.style.width = (barPosition) + "%";
  document.getElementById('player_track_time_elapsed').innerHTML = "" + min + ":" + sec;
  audio_player.currentTime = track_time_elapsed;

}


function getSampleElements() {
  audio_player = document.getElementById('audio_player');
  audio_track = document.getElementById('audio_track');
}

function changeView() {
  view *= -1;
  if (view == -1) {
    document.getElementById('playlist_list').style.display = "flex";
    document.getElementById('track_list').style.display = "none";
    document.getElementById('back_button').setAttribute('href', "#playlist_list");
  } else if (view == 1) {
    document.getElementById('playlist_list').style.display = "none";
    document.getElementById('track_list').style.display = "flex";
    document.getElementById('back_button').setAttribute('href', "#track_list");
  }
}

function changePlaylist(n) {
  currentPlaylist = n;
  currentTrack = 0;
  createTracks();
  changeView();

  if (pause == 1) {
    play_pause();
  }
}

function setVolume(v) {
  document.getElementById("audio_player").volume = (v/100);
  document.getElementById("volume_control").setAttribute('value', 0);
}

function updatePlayingTrack() {
  track_time_elapsed = 0;
  document.getElementById('player_artist_name').innerHTML = tracks[currentPlaylist][currentTrack][0];
  document.getElementById('player_track_name').innerHTML = tracks[currentPlaylist][currentTrack][1];
  let t_min = parseInt(tracks[currentPlaylist][currentTrack][2] / 60);
  let t_sec = parseInt(tracks[currentPlaylist][currentTrack][2] % 60);
  if (t_sec < 10) {
    t_sec = "0" + t_sec;
  }
  document.getElementById('player_track_time_total').innerHTML = "" + t_min + ":" + t_sec;
  document.getElementById('player_track_time_elapsed_bar').style.width = "0%";

  document.getElementById('player_album_cover').setAttribute('src', tracks[currentPlaylist][currentTrack][3]);
  document.getElementById('track_bg').style.backgroundImage = "url(" + tracks[currentPlaylist][currentTrack][3] + ")";
  document.getElementById('player_track_time_elapsed').innerHTML = "0:00";

  audio_track.src = tracks[currentPlaylist][currentTrack][4];
  audio_player.load();
  if (playing) {
    audio_player.play();
  }
}

function deleteTracks() {
  let remover = document.getElementById('track_list_view');
  if (remover) {
    remover.parentNode.removeChild(remover);
  }
}





function createTracks() {

  deleteTracks();

  document.getElementById('playlist_name').innerHTML = playlist[currentPlaylist];

  let master;

  master = document.createElement("section");
  master.setAttribute('class', "flexbox oneflex dir-col scrolling");
  master.setAttribute('id', "track_list_view");

  document.getElementById('track_list').appendChild(master);


  for (let i = 0; i < tracks[currentPlaylist].length; i++) {

    let parent;
    let child;
    let grandparent;

    parent = master;

    child = document.createElement("section");
    child.setAttribute('class', "track flexbox oneflex dir-row align-center");
    child.setAttribute('id', "view_track_" + i);

    parent.appendChild(child);
    grandparent = child;

    parent = child;

    child = document.createElement("figure");
    child.setAttribute('class', "trackpadding albumcover");
    parent.appendChild(child);

    parent = child;

    child = document.createElement("img");
    child.setAttribute('src', tracks[currentPlaylist][i][3]);
    child.setAttribute('alt', "album cover");
    parent.appendChild(child);

    parent = grandparent;

    child = document.createElement("section");
    child.setAttribute('class', "oneflex flexbox trackpadding dir-col justify-center");
    parent.appendChild(child);

    parent = child;

    child = document.createElement("ul");
    parent.appendChild(child);

    parent = child;

    child = document.createElement("li");
    child.setAttribute('class', "artist_text");
    child.innerHTML = tracks[currentPlaylist][i][0];
    parent.appendChild(child);

    child = document.createElement("li");
    child.setAttribute('class', "track_text");
    child.innerHTML = tracks[currentPlaylist][i][1];
    parent.appendChild(child);

    parent = grandparent;

    child = document.createElement("section");
    child.setAttribute('class', "trackpadding");
    child.setAttribute('onclick', "playTrack(" + i + ")");
    parent.appendChild(child);

    parent = child;

    child = document.createElement("a");
    child.setAttribute('href', "#");
    parent.appendChild(child);

    parent = child;

    child = document.createElement("i")
    child.setAttribute('class', "far fa-play-circle");
    // child.innerHTML = "x";
    parent.appendChild(child);


  }

  updatePlayingTrack();
}

function createPlaylists() {

  let master;

  master = document.createElement("section");
  master.setAttribute('class', "flexbox oneflex dir-col scrolling");
  master.setAttribute('id', "playlist_list_view");

  document.getElementById('playlist_list').appendChild(master);


  for (let i = 0; i < playlist.length; i++) {

    let parent;
    let child;
    let grandparent;

    parent = master;

    child = document.createElement("section");
    child.setAttribute('class', "track flexbox oneflex dir-row align-center");
    child.setAttribute('id', "view_playlist_" + i);

    parent.appendChild(child);
    grandparent = child;

    parent = child;

    child = document.createElement("figure");
    child.setAttribute('class', "trackpadding albumcover");
    parent.appendChild(child);

    parent = child;

    child = document.createElement("img");
    child.setAttribute('src', tracks[i][0][3]);
    child.setAttribute('alt', "album cover");
    parent.appendChild(child);

    parent = grandparent;

    child = document.createElement("section");
    child.setAttribute('class', "oneflex flexbox trackpadding dir-col justify-center");
    parent.appendChild(child);

    parent = child;

    child = document.createElement("ul");
    parent.appendChild(child);

    parent = child;

    child = document.createElement("li");
    child.setAttribute('class', "artist_text");
    child.innerHTML = playlist[i];
    parent.appendChild(child);


    parent = grandparent;

    child = document.createElement("section");
    child.setAttribute('class', "trackpadding");
    child.setAttribute('onclick', "changePlaylist(" + i + ")");
    parent.appendChild(child);

    parent = child;

    child = document.createElement("a");
    child.setAttribute('href', "#");
    parent.appendChild(child);

    parent = child;

    child = document.createElement("i");
    child.setAttribute('class', "far fa-play-circle");
    // child.innerHTML = "x";
    parent.appendChild(child);


  }

  createTracks();
}

/*
  Översätt nuvarande tid på låt till ett värde mellan 0-100
*/

function mapTo(value = track_time_elapsed, total = tracks[currentPlaylist][currentTrack][2]) {
  return Math.floor(100 * (value / total));
}


/*
  Starta spelloopen
  Tickar upp tidsåtgång för spelande låt och uppdaterar varje sekund
  Ändrar även timeline progress
*/

function startLoop() {
  playing = true;
  audio_player.play();
  playLoop = setInterval(function() {
    track_time_elapsed++;

    if (track_time_elapsed > tracks[currentPlaylist][currentTrack][2]) {
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
Stannar spelloopen
*/
function stopLoop() {
  playing = false;
  audio_player.pause();
  clearTimeout(playLoop);
}

/*
  Shufflar en låt i spellistan
*/
function doShuffle() {
  return Math.floor(Math.random() * Math.floor(tracks[currentPlaylist].length));
}


/*
  Väljer en ny låt att spela
  Antingen om användaren spolar eller om låten tar slut
  Olika utfall beroende på repeat och/eller shuffle
*/

function nextTrack(n = 0) {
  if (repeat == 1 && n == 0) {
    // Do nothing
  } else if (shuffle == 1) {

    let newTrack;
    do {
      newTrack = doShuffle();
    } while (currentTrack == newTrack);

    currentTrack = newTrack;

  } else if (n != 0) {

    currentTrack += n;
    if (currentTrack < 0) {
      currentTrack = 0;
    } else if (currentTrack == tracks[currentPlaylist].length) {
      currentTrack--;
    }

  } else {
    currentTrack++;
  }

  track_time_elapsed = 0;

  if (currentTrack < tracks[currentPlaylist].length) {
    updatePlayingTrack();
  } else {
    currentTrack--;
    play_pause();
  }
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
  updatePlayingTrack();
  if (pause == 1) {
    play_pause();
  } else if (!playing) {
    startLoop();
  }
}
