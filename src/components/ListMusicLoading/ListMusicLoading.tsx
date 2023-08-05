import "./ListMusicLoading.scss";

const ListMusicLoading = () => {
  return (
    <div className="loading">
      <div className="wrapper">
        <div className="list-music">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="music-item">
                <div className="music-description skeleton-loading"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ListMusicLoading;
