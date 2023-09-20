export class PlayList{
    title: string;
    image: string;
    encodeId: string;
    artistsNames: string;

    constructor(
        title: string,
        image: string,
        encodeId: string,
        artistsNames: string,
    ){
        this.encodeId = encodeId;
        this.image = image;
        this.title = title;
        this.artistsNames = artistsNames;
    }
}