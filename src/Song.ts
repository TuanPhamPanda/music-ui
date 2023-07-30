export class Song {
  path: string;
  displayName: string;
  cover: string;
  artist: string;
  duration: number;

  constructor(
    path: string,
    displayName: string,
    cover: string,
    artist: string,
    duration: number = 0
  ) {
    this.path = path;
    this.displayName = displayName;
    this.cover = cover;
    this.artist = artist;
    this.duration = duration;
  }
}
