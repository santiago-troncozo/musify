import { Component, OnInit } from '@angular/core';

import { AlbumService } from 'src/app/services/album.service'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { GLOBAL } from 'src/app/services/global'
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'album-list',
  templateUrl: '../views/album-list.html',
  providers: [UserService, AlbumService]
})
export class AlbumListComponent implements OnInit {
  private albums
  private artists
  private confirmado: boolean
  private titulo: string
  private identity
  private token
  private url
  private alertMessage
  private genres
  public genreSelected

  constructor(
    private _albumService: AlbumService,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _router: Router,
  ) {
    this.titulo = "Albums"
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken()
    this.url = GLOBAL.url
  }


  ngOnInit() {
    // Conseguir el listado de albums
    this._albumService.getGenres(this.token).toPromise().then(
      (response: any) => {
        this.genres = response.generos
        if (response.generos.length > 0) {
          this.genreSelected = this.genres[0].description
        }
      }).then(() => {
        this.getAlbums()
      })
  }


  getAlbums() {
    this._route.queryParams.subscribe(params => {
      this.genreSelected = params.genre
      this._albumService.getAllAlbums(this.token).toPromise().then(
        (response: any) => {
          this.albums = response.albums
          this.artists = response.albums.map(param => param.artist)
          this.artists = this.getUnique(this.artists, "_id")
          let albums
          this.artists.forEach(artist => {
            albums = this.albums.filter(album => album.artist._id === artist._id)
            Object.defineProperty(artist, "albums", { value: albums })
          })
          if (this.genreSelected) {
            this.artists = this.artists.filter(artist => artist.genre === this.getGenreId(this.genreSelected))
          }
        }, this.errorFunc
      )
    })

  }

  getUnique(arr, comp) {

    const unique = arr
      .map(e => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e]).map(e => arr[e]);

    return unique;
  }


  onDeleteConfirm(id) {
    this.confirmado = id
  }

  onCancelArtist() {
    this.confirmado = null
  }

  onDeleteAlbum(id) {
    this._albumService.deleteAlbum(this.token, id).subscribe(
      (response: any) => {
        if (!response.albumRemoved) {
          alert("Error en el servidor")
        } else {
          this.getAlbums()
        }
      }, this.errorFunc
    );
  }

  onChange(opt) {
    this.genreSelected = opt
    if (this.genreSelected === "Todos los generos") {
      this._router.navigate(['/albums/']);
    } else {
      this._router.navigate(['/albums/'], { queryParams: { genre: this.genreSelected } });
    }
  }


  getGenreId(genre): string {
    let id = ""
    this.genres.forEach(element => {
      if (element.description === genre) {
        id = element._id
      }
    });
    return id
  }

  errorFunc(error) {
    var errorMessage = <any>error;
    if (errorMessage != null) {

      console.log(error);
    }
  }



}
