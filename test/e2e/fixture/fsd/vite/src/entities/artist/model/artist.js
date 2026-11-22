import { createSong } from "@/entities/song/@x/artist";

export function createArtist(name) {
	return { name, songs: [createSong(name)] };
}
