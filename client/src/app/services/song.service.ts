import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from "rxjs-compat"
import { GLOBAL } from "./global"
import { Song } from "../models/song"
import { SubscriptionLoggable } from 'rxjs/internal/testing/SubscriptionLoggable'

@Injectable()
export class SongService {
    public url: string

    constructor(public http: HttpClient) {
        this.url = GLOBAL.url
    }
    addSong(token, song: Song) {
        let params = JSON.stringify(song)
        let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", token)
        return this.http.post(this.url + "song", params, { headers: headers })
    }

    getSongs(token, albumId = null){
        let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)
        if(!albumId){
            return this.http.get(this.url + "songs/", { headers: headers })
        } else{
            return this.http.get(this.url + "songs/" + albumId, { headers: headers })
        }
    }  
    getSong(token, id: string){
        let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)
        return this.http.get(this.url + "song/" + id, { headers: headers })
    }

    editSong(token,id: string, song: Song) {
        let params = JSON.stringify(song)
        let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", token)
        return this.http.put(this.url + "song/" + id, params, { headers: headers })
    } 

    deleteSong(token, id: string){
        let headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", token)
        return this.http.delete(this.url + "song/" + id, { headers: headers })
    }

    getSongsByName(name: string, order: string, token: string ){
        let body = JSON.stringify({name: name, order: order})
        let headers = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded").set("Authorization", token)
        return this.http.post(this.url + "search/song", body, { headers: headers })
    }

}