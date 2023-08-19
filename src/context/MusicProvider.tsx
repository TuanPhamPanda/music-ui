import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useContext,
} from "react";

type MusicContextType = {
  sourceMusic: string | undefined;
  setSourceMusic: Dispatch<SetStateAction<string | undefined>>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicContext = () => {
  const context = useContext(MusicContext);

  if (!context) {
    throw new Error("useMusicContext must be used within a MusicProvider");
  }

  return context;
};
interface MusicProviderProps {
  children: React.ReactNode;
}

const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [sourceMusic, setSourceMusic] = useState<string | undefined>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const contextValue: MusicContextType = {
    sourceMusic,
    setSourceMusic,
    isPlaying,
    setIsPlaying,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
