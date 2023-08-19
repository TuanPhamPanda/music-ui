import { useEffect, useState } from "react";
import "./App.scss";
import { Song } from "./Song";
import axios from "./apis/axios";
import ListMusicLoading from "./components/ListMusicLoading/ListMusicLoading";
import ListMusic from "./components/ListMusic/ListMusic";
import MusicLoading from "./components/MusicLoading/MusicLoading";
import Music from "./components/Music/Music";
import { MusicProvider } from "./context";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [songs, setSongs] = useState<Array<Song>>([]);
  const [musicIndex, setMusicIndex] = useState(0);
  const [arrayEncodeID, setArrayEncodeID] = useState<Array<string>>([]);

  useEffect(() => {
    axios.get(`/`).then((value) => {
      const arrayTemp = value.data.items
        .filter(
          (item: { sectionType: string; items: [] }) =>
            item.sectionType === "playlist" && item.items
        )
        .map((item: { items: [] }) => {
          const arrayStringTemp = item.items.map(
            (item: { encodeId: string }) => item.encodeId
          );
          return arrayStringTemp;
        });
      setArrayEncodeID([...new Set([].concat(...arrayTemp))]);
    });
  }, []);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      const promises = arrayEncodeID.map((item) =>
        axios.get(`/playlist/${item}`)
      );
      try {
        const responses = await Promise.all(promises);
        const arrayTemp: Song[] = [];

        responses.forEach((response) => {
          const arrays = response.data.data.song.items;
          if (arrays.length >= 30 && arrays.length <= 50) {
            arrays.forEach(
              (item: {
                encodeId: string;
                duration: number;
                thumbnailM: string;
                artistsNames: string;
                title: string;
              }) => {
                const { encodeId, duration, thumbnailM, artistsNames, title } =
                  item;
                arrayTemp.push(
                  new Song(encodeId, title, thumbnailM, artistsNames, duration)
                );
              }
            );
          }
        });

        setSongs(
          arrayTemp.filter((song, index, self) => {
            const isUnique = !self
              .slice(0, index)
              .some((s) => s.path === song.path);
            return isUnique;
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlaylistData();
  }, [arrayEncodeID]);

  return (
    <MusicProvider>
      {songs.length > 0 ? (
        <Music
          onMusicIndex={setMusicIndex}
          song={songs[musicIndex]}
          songsLength={songs.length}
        />
      ) : (
        <MusicLoading />
      )}
      {songs.length === 0 ? (
        <ListMusicLoading />
      ) : (
        <ListMusic onMusicIndex={setMusicIndex} songs={songs} />
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </MusicProvider>
  );
}

export default App;
