import { Song } from "../../Song";
import "./ListMusic.scss";
import { useEffect, useState } from "react";
import Search from "../Search/Search";
import MusicItem from "./MusicItem";
import { removeVietnameseDiacritics } from "../../utils/fn";

interface ListMusicProps {
  songs: Array<Song>;
  onMusicIndex: (index: number) => void;
  isShowHidList: boolean;
}

const ListMusic: React.FC<ListMusicProps> = ({ songs, onMusicIndex, isShowHidList }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [search, setSearch] = useState("");
  const [currentSongs, setCurrentSongs] = useState<Array<Song>>([]);

  useEffect(() => {
    const arrays: Array<Song> = songs.filter((song: Song) =>
      song
        .convertVietnameseToEnglish()
        .includes(removeVietnameseDiacritics(search))
    );
    setCurrentSongs(arrays);
  }, [search, songs]);

  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };

  const handleMouseEnter = () => {
    setIsMouseOver(true);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className={`wrapper ${isShowHidList || 'show-hide'}`}>
      <Search searchInput={search} onChangeInput={handleChangeInput} />
      <div
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className={`list-music ${isMouseOver ? "hide-scrollbar" : ""} ${
          songs.length === 0 ? "skeleton" : ""
        }`}
      >
        {search === "" ? (
          songs.map((song: Song, index: number) => (
            <MusicItem
              key={index}
              index={index}
              onMusicIndex={onMusicIndex}
              song={song}
            />
          ))
        ) : currentSongs.length === 0 ? (
          <div className="not-found">
            <span>Không tìm thấy kết quả</span>
          </div>
        ) : (
          currentSongs.map((song: Song) => (
            <MusicItem
              key={song.path}
              index={songs.findIndex((s: Song) => s.path === song.path)}
              onMusicIndex={onMusicIndex}
              song={song}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ListMusic;
