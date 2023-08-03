import { useEffect, useState } from "react";
import "./App.scss";
import { Song } from "./Song";
import axios from "./apis/axios";
import ListMusic from "./components/ListMusic/ListMusic";
import Music from "./components/Music/Music";

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
          //filter with path in class Song
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
    <>
      <Music
        onMusicIndex={setMusicIndex}
        song={songs[musicIndex]}
        songsLength={songs.length}
      />
      <ListMusic onMusicIndex={setMusicIndex} songs={songs} />
    </>
  );
}

export default App;
