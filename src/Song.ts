export class Song {
    path: string;
    displayName: string;
    cover: string;
    artist: string;
  
    constructor(path: string, displayName: string, cover: string, artist: string) {
      this.path = path;
      this.displayName = displayName;
      this.cover = cover;
      this.artist = artist;
    }
  }