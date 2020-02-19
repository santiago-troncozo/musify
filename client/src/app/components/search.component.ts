import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/models/album'
import { Song } from 'src/app/models/song'
import { Artist } from 'src/app/models/artist'
import { AlbumService } from 'src/app/services/album.service'
import { SongService } from 'src/app/services/song.service'
import { ArtistService } from 'src/app/services/artist.service'
import { UserService } from 'src/app/services/user.service'
import { GLOBAL } from 'src/app/services/global'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { AlbumDetailComponent } from 'src/app/components/album-detail.component'

@Component({
  selector: 'app-search',
  templateUrl: '../views/search.html',
  providers: [AlbumService, SongService, ArtistService, UserService]
})

export class SearchComponent implements OnInit {
  private songs: Song[]
  private artists: Artist[]
  private albums: Album[]
  private searchWords: string
  private ok: boolean
  private alertMessage: string
  private token: string
  private url: string
  private order
  private params
  private title

  constructor(
    private _artistService: ArtistService,
    private _songService: SongService,
    private _albumService: AlbumService,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _router: Router,

  ) {
    this.title = "Sección de busqueda"
    this.ok = false
    this.token = _userService.getToken()
    this.url = GLOBAL.url
    this.order = "Ascendente"
  }

  ngOnInit() {
    this._route.queryParams
      .subscribe(params => {
        this.searchWords = params["q"]
        this.order = params["order"]
        if (!this.order) {
          this.order = "asc"
        }
        if (this.searchWords) {
          this.ok = true
          this.getAlbums()
          this.getSongs()
          this.getArtists()
        } else {
          this.ok = false
        }
      })
  }


  goSearch() {
    if (this.searchWords) {
      this._router.navigate(['/search'], { queryParams: { order: this.order, 'q': this.searchWords } });
    } else {
      this._router.navigate(['/search']);
    }
  }


  getAlbums() {
    this._albumService.getAlbumsByTitle(this.searchWords, this.order, this.token).subscribe(
      (response: any) => {
        if (response) {
          this.albums = response.albums
        }
      },this.errorFunc
      )
  }


  getSongs() {
    this._songService.getSongsByName(this.searchWords, this.order, this.token).subscribe(
      (response: any) => {
        if (response) {
          this.songs = response.songs
        }
      },this.errorFunc
      )
  }

  
  getArtists() {
    this._artistService.getArtistsByName(this.searchWords, this.order, this.token).subscribe(
      (response: any) => {
        if (response) {
          this.artists = response.artists
        }
      }, this.errorFunc
      )
  }

  onChange(option) {
    if (option === 0) {
      this.order = "asc"
    } else {
      this.order = "desc"
    }
    this.goSearch()
  }


  startPlayer(song) {
    let song_player = JSON.stringify(song);
    let file_path = this.url + 'get-song-file/' + song.file;
    let image_path = this.url + 'get-image-album/' + song.album.image;

    localStorage.setItem('sound_song', song_player);

    document.getElementById("mp3-source").setAttribute("src", file_path);
    (document.getElementById("player") as any).load();
    (document.getElementById("player") as any).play();

    document.getElementById('play-song-title').innerHTML = song.name;
    document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
    document.getElementById('play-image-album').setAttribute('src', image_path);

  }

  
  errorFunc(error) {
    var errorMessage = <any>error
    if (!errorMessage) {
      this.alertMessage = error.message
      console.log(error)
    }
  }
}