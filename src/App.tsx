import { useEffect, useInsertionEffect, useRef, useState } from "react";
import "./App.css";
import { Song } from "./Song";

function App() {
  const songs: Array<Song> = [
    new Song(
      "src/assets/1.mp3",
      "The Charmer's Call",
      "src/assets/1.jpg",
      "Hanu Dixit"
    ),
    new Song(
      "src/assets/2.mp3",
      "You Will Never See Me Coming",
      "src/assets/2.jpg",
      "NEFFEX"
    ),
    new Song("src/assets/3.mp3", "Intellect", "src/assets/3.jpg", "Yung Logos"),
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0);
  const [music, setMusic] = useState(new Audio(songs[musicIndex].path));

  useEffect(() => {
    updateProgressBar();
  });

  const image = useRef();
  const title = useRef();
  const artist = useRef();
  const currentTimeEl = useRef();
  const durationEl = useRef();
  const progress = useRef();
  const playerProgress = useRef();
  const playBtn = useRef();
  const background = useRef();

  useEffect(() => {
    loadMusic(songs[musicIndex]);
  }, [musicIndex]);

  useEffect(() => {
    if (!isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }, [isPlaying]);

  function pauseMusic() {
    playBtn.current.classList.replace("fa-pause", "fa-play");
    playBtn.current.setAttribute("title", "Play");
    music.pause();
  }

  function playMusic() {
    playBtn.current.classList.replace("fa-play", "fa-pause");
    playBtn.current.setAttribute("title", "Pause");
    music.play().catch((err) => {
      setIsPlaying(false);
      pauseMusic();
    });
  }

  function loadMusic(song: Song) {
    music.src = song.path;
    title.current.textContent = song.displayName;
    artist.current.textContent = song.artist;
    image.current.src = song.cover;
    background.current.src = song.cover;
  }

  function changeMusic(direction) {
    setMusicIndex((musicIndex + direction + songs.length) % songs.length);
    loadMusic(songs[musicIndex]);
    playMusic();
  }

  const [time, setTime] = useState(0);
  music.addEventListener("timeupdate", (e) => setTime(e.timeStamp));

  useEffect(() => {
    updateProgressBar();
  }, [time]);

  function updateProgressBar() {
    const { currentTime, duration } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.current.style.width = `${progressPercent}%`;
    const formatTime = (time) => String(Math.floor(time)).padStart(2, "0");

    currentTimeEl.current.textContent = `${formatTime(
      currentTime / 60
    )}:${formatTime(currentTime % 60)}`;

    if (isNaN(duration)) {
      durationEl.current.textContent = "00:00";
    } else {
      durationEl.current.textContent = `${formatTime(
        duration / 60
      )}:${formatTime(duration % 60)}`;
    }
  }

  function setProgressBar(e) {
    const width = playerProgress.current?.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const currentTime = (clickX / width) * music.duration;
    music.currentTime = currentTime;
    setMusic(music);
  }

  return (
    <>
      <div className="background">
        <img ref={background} />
      </div>
      <div className="container">
        <div className="player-img">
          <img ref={image} className="active" id="cover" />
        </div>
        <h2 ref={title}></h2>
        <h3 ref={artist}></h3>
        <div
          className="player-progress"
          ref={playerProgress}
          onClick={(e) => setProgressBar(e)}
        >
          <div className="progress" ref={progress}>
            <div className="music-duration">
              <span ref={currentTimeEl}></span>
              <span ref={durationEl}></span>
            </div>
          </div>
        </div>
        <div className="player-controls">
          <i
            className="fa-solid fa-backward"
            onClick={() => changeMusic(-1)}
            title="Previous"
          ></i>
          <i
            ref={playBtn}
            className="fa-solid fa-play play-button"
            onClick={() => setIsPlaying((prev) => !prev)}
            title="Play"
          ></i>
          <i
            className="fa-solid fa-forward"
            onClick={() => changeMusic(1)}
            title="Next"
          ></i>
        </div>
      </div>
    </>
  );
}

export default App;
