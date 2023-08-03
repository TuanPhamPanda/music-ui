import { Song } from "../../Song";
import { convertMinutesToTime } from "../../utils/fn";

interface MusicItemProps {
  song: Song;
  onMusicIndex: (index: number) => void;
  index: number;
}

const MusicItem: React.FC<MusicItemProps> = ({ song, onMusicIndex, index }) => {
  return (
    <div className="music-item">
      <img
        onClick={() => {
          onMusicIndex(index);
        }}
        src={song.cover}
        alt="img"
      />
      <div className="music-description">
        <span
          className="text-capitalize"
          onClick={() => {
            onMusicIndex(index);
          }}
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

export default MusicItem;
