import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs-compat"
import { GLOBAL } from "./global"
import { Artist } from "../models/artist"

@Injectable()
export class ArtistService {
    public url: string

    constructor(public http: HttpClient) {
        this.url = GLOBAL.url
    }
    getArtists(token, page) {
        let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)
        return this.http.get(this.url + "artists/" + page, { headers: headers })
    }
    getArtist(token, id: string) {
        let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)
        return this.http.get(this.url + "artist/" + id, { headers: headers })
    }
    addArtist(token, artist: Artist) {
        let params = JSON.stringify(artist)
        let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", token)
        return this.http.post(this.url + "artist", params, { headers: headers })
    }
    editArtist(token, id: string, artist: Artist) {
        let params = JSON.stringify(artist)
        let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", token)

        return this.http.put(this.url + "artist/" + id, params, { headers: headers })
    }

    deleteArtist(token, id: string) {
        let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)
        return this.http.delete(this.url + "artist/" + id, { headers: headers })
    }


    getArtistsByName(name: string, order: string, token: string){
        let params = JSON.stringify({name: name, order: order})
        let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", token)
        return this.http.post(this.url + "search/artist",params, { headers: headers })
    }

    getGenres(token: string){
        let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)
        return this.http.get(this.url + "artist-genres", {headers: headers})
    }
    saveGenre(genre, token: string){
        const body = JSON.stringify(genre)
        let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", token)
        return this.http.post(this.url + "save-genre",body, {headers: headers})
    }
    getArtistByGenre(genre, page, token: string){
        let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)
        return this.http.get(this.url + "filter-artist/"+ genre+"/"+page, {headers: headers})
    }
}