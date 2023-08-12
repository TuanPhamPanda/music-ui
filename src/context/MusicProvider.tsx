import {
  createContext,
  useState,
  useEffect,
} from "react";

export const MusicContext = createContext<{
    sourceMusic: string | undefined;
    setSourceMusic: React.Dispatch<React.SetStateAction<string | undefined>>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  } | undefined>(undefined);

interface MusicProviderProps {
  children: React.ReactNode;
}

const MusicProvider:React.FC<MusicProviderProps> = ({ children }) => {

    const [sourceMusic, setSourceMusic] = useState<string|undefined>();
    const [isPlaying, setIsPlaying] = useState(false);

  return (
    <MusicContext.Provider value={{ sourceMusic, setSourceMusic, isPlaying, setIsPlaying }}>
    {children}
  </MusicContext.Provider>
  );
};

export default MusicProvider;
