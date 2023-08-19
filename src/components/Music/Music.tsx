import axios from "../../apis/axios";
import { Song } from "../../Song";
import { convertMinutesToTime } from "../../utils/fn";
import "./Music.scss";
import { useEffect, useRef, useState } from "react";
import { useMusicContext } from "../../context/MusicProvider";
import { toast } from "react-toastify";

// props: setIndex, song, songsLength
interface MusicProps {
  onMusicIndex: React.Dispatch<React.SetStateAction<number>>;
  song: Song;
  songsLength: number;
}

const Music: React.FC<MusicProps> = ({ onMusicIndex, song, songsLength }) => {
  const { isPlaying, setIsPlaying, sourceMusic, setSourceMusic } =
    useMusicContext();

  const [music] = useState(() => new Audio(sourceMusic));
  const background = useRef<HTMLImageElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const durationEl = useRef<HTMLDivElement>(null);
  const playerProgress = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);
  const currentTimeEl = useRef<HTMLDivElement>(null);
  const playBtn = useRef<HTMLDivElement>(null);
  const artist = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSourceMusic = async () => {
      setIsPlaying(false);

      if (song) {
        music.currentTime = 0;
        loadMusic(song);
        if (progress.current && currentTimeEl.current) {
          progress.current.style.width = "0%";
          currentTimeEl.current.textContent = "00:00";
        }
        const musicSource = await axios.get(
          `${import.meta.env.VITE_SERVER}/${song.path}`
        );
        
        if (musicSource.data.data) {
          
          await setSourceMusic(musicSource.data.data["128"]);
          await setIsPlaying(true);
        } else {
          await setSourceMusic("Not found");
        }
      }
    };
    fetchSourceMusic();
  }, [song]);

  useEffect(() => {
    if (sourceMusic === "Not found") {
      setIsPlaying(false);
      toast.error("Không thể phát bài này.");
    } else if (sourceMusic?.startsWith("https://")) {
      music.src = sourceMusic;
    }
    
  }, [sourceMusic]);

  function playMusic() {
    if (playBtn.current) {
      playBtn.current.classList.replace("fa-play", "fa-pause");
      playBtn.current.setAttribute("title", "Pause");
      music.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }

  function updateProgressBar() {
    const { currentTime } = music;
    const duration = song?.duration;

    if (Math.ceil(currentTime) === duration) {
      onMusicIndex((prev) => ++prev);
    }

    const progressPercent = (currentTime / duration) * 100;
    if (progress.current) {
      progress.current.style.width = `${progressPercent}%`;
    }

    const formatTime = (time: number) =>
      String(Math.floor(time)).padStart(2, "0");

    if (currentTimeEl.current) {
      currentTimeEl.current.textContent = `${formatTime(
        currentTime / 60
      )}:${formatTime(currentTime % 60)}`;
    }

    if (durationEl.current) {
      durationEl.current.textContent = convertMinutesToTime(song.duration);
    }
  }

  useEffect(() => {
    if (!isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }, [isPlaying]);

  function setProgressBar(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (playerProgress.current) {
      const width = playerProgress.current.clientWidth;
      const clickX = e.nativeEvent.offsetX;
      const currentTime = (clickX / width) * music.duration;
      music.currentTime = currentTime;
      setTime(currentTime);
    }
  }

  function loadMusic(song: Song) {
    if (song) {
      if (
        title.current &&
        artist.current &&
        image.current &&
        background.current &&
        durationEl.current
      ) {
        title.current.textContent =
          song.displayName.length > 30
            ? `${song.displayName.substring(0, 30)}....`
            : song.displayName;
        artist.current.textContent =
          song.artist.length > 35
            ? `${song.artist.substring(0, 35)}....`
            : song.artist;
        image.current.src = song.cover;
        background.current.src = song.cover;
        durationEl.current.textContent = convertMinutesToTime(song.duration);
      }
    }
  }

  useEffect(() => {
    updateProgressBar();
  }, [time]);

  function changeMusic(direction: number) {
    onMusicIndex((prev) => (prev + direction + songsLength) % songsLength);
  }

  function pauseMusic() {
    music.pause();
    if (playBtn.current) {
      playBtn.current.classList.replace("fa-pause", "fa-play");
      playBtn.current.setAttribute("title", "Play");
    }
  }

  music.addEventListener("timeupdate", (e: Event) => setTime(e.timeStamp));

  return (
    <>
      <div className="background">
        <img ref={background} />
      </div>
      <div className={`container ${!song ? "skeleton" : ""}`}>
        {song && (
          <>
            <div className="player-img">
              <img ref={image} className="active" id="cover" />
            </div>
            <h2 className="text-capitalize" ref={title}></h2>
            <h3 className="text-capitalize" ref={artist}></h3>

            <div className="player-progress">
              <div ref={playerProgress} onClick={(e) => setProgressBar(e)}>
                <div className="progress" ref={progress}></div>
              </div>
              <div className="music-duration">
                <span ref={currentTimeEl}>00:00</span>
                <span ref={durationEl}></span>
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
                onClick={() => {
                  if (sourceMusic === "Not found") {
                    toast.error("Không thể phát bài này.");
                  } else if (sourceMusic?.startsWith("https://")) {
                    setIsPlaying((prev: boolean) => !prev);
                  } else {
                    return;
                  }
                }}
                title="Play"
              ></i>
              <i
                className="fa-solid fa-forward"
                onClick={() => changeMusic(1)}
                title="Next"
              ></i>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Music;
