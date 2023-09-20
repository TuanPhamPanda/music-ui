import axios from "../../apis/axios";
import { Song } from "../../Song";
import { convertMinutesToTime } from "../../utils/fn";
import "./Music.scss";
import React, { useEffect, useRef, useState } from "react";
import { useMusicContext } from "../../context/MusicProvider";
import { toast } from "react-toastify";
import { icons } from "../../utils/icons";
import { pausePlay, sizeIcon } from "../../utils/constant";

interface MusicProps {
  isShowList: boolean;
  onShowList: React.Dispatch<React.SetStateAction<boolean>>;
  onMusicIndex: React.Dispatch<React.SetStateAction<number>>;
  song: Song;
  songsLength: number;
}

const Music: React.FC<MusicProps> = ({
  isShowList,
  onShowList,
  onMusicIndex,
  song,
  songsLength,
}) => {
  const {
    isPlaying,
    setIsPlaying,
    sourceMusic,
    setSourceMusic,
    isRandom,
    setIsRandom,
  } = useMusicContext();

  const {
    BiSkipNext,
    IoPauseCircleOutline,
    IoPlayCircleOutline,
    BiSolidPlaylist,
    BiSkipPrevious,
    LiaRandomSolid,
  } = icons;

  const [music] = useState(() => new Audio(sourceMusic));
  const background = useRef<HTMLImageElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const durationEl = useRef<HTMLDivElement>(null);
  const playerProgress = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);
  const currentTimeEl = useRef<HTMLDivElement>(null);
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

          //await setIsPlaying(true);
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
      toast.error(`Không thể phát bài ${song.displayName}.`);
    } else if (sourceMusic?.startsWith("https://")) {
      music.src = sourceMusic;
    }
  }, [sourceMusic]);

  useEffect(() => {
    updateProgressBar();
  }, [time]);

  useEffect(() => {
    if (!isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }, [isPlaying]);

  function playMusic() {
    music.play().catch(() => {
      setIsPlaying(false);
    });
  }

  function updateProgressBar() {
    const { currentTime } = music;
    const duration = song?.duration;

    if (Math.floor(currentTime) === duration) {
      onMusicIndex((prev) =>
        isRandom ? Math.floor(Math.random() * songsLength) : ++prev
      );
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

  function changeMusic(direction: number) {
    isRandom
      ? onMusicIndex(Math.floor(Math.random() * songsLength))
      : onMusicIndex((prev) => (prev + direction + songsLength) % songsLength);
  }

  function pauseMusic() {
    music.pause();
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
                <div
                  style={{
                    backgroundColor: "black",
                    width: "3px",
                    height: "100%",
                  }}
                ></div>
              </div>
              <div className="music-duration">
                <span ref={currentTimeEl}>00:00</span>
                <span ref={durationEl}></span>
              </div>
            </div>

            <div className="player-controls">
              <LiaRandomSolid
                className={`${isRandom ? "random" : ""}`}
                onClick={() => {
                  isRandom ? setIsRandom(false) : setIsRandom(true);
                }}
                size={sizeIcon}
              />

              <BiSkipPrevious onClick={() => changeMusic(-1)} size={sizeIcon} />

              {isPlaying ? (
                <IoPauseCircleOutline
                  onClick={() => {
                    setIsPlaying(false);
                    pauseMusic();
                  }}
                  size={pausePlay}
                />
              ) : (
                <IoPlayCircleOutline
                  onClick={() => {
                    setIsPlaying(true);
                    playMusic();
                  }}
                  size={pausePlay}
                />
              )}

              <BiSkipNext onClick={() => changeMusic(1)} size={sizeIcon} />

              <BiSolidPlaylist
                className={`${isShowList || 'show-hide-list'}`}
                onClick={() => onShowList((prev) => !prev)}
                size={sizeIcon}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Music;
