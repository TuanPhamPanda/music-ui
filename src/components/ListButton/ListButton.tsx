import React from "react";
import "./ListButton.scss";
import { icons } from "../../utils/icons";
import { pausePlay, sizeIcon } from "../../utils/constant";
import { useMusicContext } from "../../context/MusicProvider";
import { toast } from "react-toastify";

interface ListButtonProps {
  isRandom: boolean;
  isPlaying: boolean;
  isShowList: boolean;

  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRandom: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowList: React.Dispatch<React.SetStateAction<boolean>>;
  changeMusic: (direction: number) => void;
  playMusic: () => void;
  pauseMusic: () => void;
}

const ListButton: React.FC<ListButtonProps> = (props: ListButtonProps) => {
  const {
    isRandom,
    isPlaying,
    isShowList,
    setIsShowList,
    setIsPlaying,
    setIsRandom,
    changeMusic,
    playMusic,
    pauseMusic,
  } = props;

  const {
    LiaRandomSolid,
    BiSkipPrevious,
    IoPauseCircleOutline,
    IoPlayCircleOutline,
    BiSkipNext,
    BiSolidPlaylist,
  } = icons;

  const { sourceMusic } = useMusicContext();

  return (
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
            if(sourceMusic === 'Not found'){
              toast.error('Không thể phát bài này!')
              return;
            }
            setIsPlaying(true);
            playMusic();
          }}
          size={pausePlay}
        />
      )}

      <BiSkipNext onClick={() => changeMusic(1)} size={sizeIcon} />

      <BiSolidPlaylist
        onClick={() => setIsShowList((prev) => !prev)}
        className={`${isShowList ? "show-hide-list" : ""}`}
        size={sizeIcon}
      />
    </div>
  );
};

export default ListButton;
