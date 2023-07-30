import { Song } from "../../Song";
import "./ListMusic.scss";
import { convertMinutesToTime } from "../../utils/fn";
import { useState } from "react";

interface ListMusicProps {
  songs: Array<Song>,
  onMusicIndex: (index: number) => void;
}

const ListMusic: React.FC<ListMusicProps> = ({ songs, onMusicIndex }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };

  const handleMouseEnter = () => {
    setIsMouseOver(true);
  };
  return (
    <div
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`list-music ${isMouseOver ? "hide-scrollbar" : ""}`}
    >
      {songs.map((song: Song, index: number) => {
        return (
          <div key={index} className="music-item">
            <img onClick={() => {onMusicIndex(index)}} src={song.cover} alt="img" />
            <div className="music-description">
              <span onClick={()=>{onMusicIndex(index)}} style={{ cursor: "pointer" }}>{song.displayName}</span>
              <div>
                <span>{song.artist}</span>
                <span>{convertMinutesToTime(song.duration)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListMusic;
