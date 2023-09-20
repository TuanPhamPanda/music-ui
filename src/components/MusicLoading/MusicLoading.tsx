import { pausePlay, sizeIcon } from "../../utils/constant";
import { icons } from "../../utils/icons";
import "./MusicLoading.scss";

interface MusicLoadingProps {
  isShowList: boolean;
  onShowList: React.Dispatch<React.SetStateAction<boolean>>;
}

const MusicLoading: React.FC<MusicLoadingProps> = ({
  isShowList,
  onShowList,
}) => {
  const {
    LiaRandomSolid,
    BiSkipPrevious,
    IoPlayCircleOutline,
    BiSkipNext,
    BiSolidPlaylist,
  } = icons;

  return (
    <div className="music-loading">
      <div className="container">
        <div className="player-img">
          <div className="active skeleton-loading"></div>
        </div>
        <div className="music-description">
          <div className="skeleton-loading"></div>
          <div className="skeleton-loading"></div>
        </div>

        <div className="player-controls">
          <LiaRandomSolid size={sizeIcon} />

          <BiSkipPrevious size={sizeIcon} />

          <IoPlayCircleOutline size={pausePlay} />

          <BiSkipNext size={sizeIcon} />

          <BiSolidPlaylist
        className={`${isShowList && "show-hide-list"}`}
        onClick={() => onShowList((prev) => !prev)}
            size={sizeIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicLoading;
