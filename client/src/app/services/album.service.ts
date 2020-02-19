import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { GLOBAL } from './global';
import { Album } from '../models/album';

@Injectable()
export class AlbumService {
	public url: string;

	constructor(private http: HttpClient) {
		this.url = GLOBAL.url;
	}

	getAlbums(token, page, artistId = null) {
		let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)

		if (!artistId) {
			return this.http.get(this.url + "albums/", { headers: headers })
		} else {
			return this.http.get(this.url + "albums/" + artistId + "/" + page, { headers: headers })
		}

	}
	getAllAlbums(token) {
		let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)
		return this.http.get(this.url + "get-all-albums/", { headers: headers })
	}

	

	getAlbum(token, id: string) {
		let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)

		return this.http.get(this.url + 'album/' + id, { headers: headers })
	}

	addAlbum(token, album: Album) {
		let params = JSON.stringify(album);
		let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", token)
		return this.http.post(this.url + 'album', params, { headers: headers })
	}

	editAlbum(token, id: string, album: Album) {
		let params = JSON.stringify(album);
		let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", token)

		return this.http.put(this.url + 'album/' + id, params, { headers: headers })

	}

	deleteAlbum(token, id: string) {
		let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)

		return this.http.delete(this.url + 'album/' + id, { headers: headers })
	}

	getAlbumsByTitle(title: string, order: string, token: string) {
		let body = JSON.stringify({ title: title, order: order })
		let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", token)
		return this.http.post(this.url + "search/album", body, { headers: headers })
	}

	getGenres(token: string) {
		let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)
		return this.http.get(this.url + "artist-genres", { headers: headers })
	}


	getAlbumsByGenre(page, genre: string, token: string) {

		let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)
		return this.http.get(this.url + "filter-albums/" + genre + "/" + page, { headers: headers })
	}

}