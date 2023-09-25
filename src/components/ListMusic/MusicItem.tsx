import { memo } from "react";
import { Song } from "../../Song";
import { useMusicContext } from "../../context/MusicProvider";
import { convertMinutesToTime } from "../../utils/fn";

interface MusicItemProps {
  song: Song;
  onMusicIndex: (index: number) => void;
  index: number;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const MusicItem: React.FC<MusicItemProps> = ({
  song,
  onMusicIndex,
  index,
  setSearch,
}) => {
  const { idSong } = useMusicContext();

  const handleChooseMusic = () => {
    onMusicIndex(index);

    setTimeout(() => {
      setSearch("");
    }, 1000);
  };

  return (
    <div className={`music-item ${song.path === idSong ? "active" : ""}`}>
      <img onClick={handleChooseMusic} src={song.cover} alt="img" />
      <div className="music-description">
        <span
          className="text-capitalize"
          onClick={handleChooseMusic}
          style={{ cursor: "pointer" }}
        >
          {song.displayName}
        </span>
        <div>
          <span className="text-capitalize">{song.artist}</span>
          <span>{convertMinutesToTime(song.duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(MusicItem);
