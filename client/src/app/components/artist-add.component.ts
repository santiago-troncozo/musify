import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-add',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public url: string;
	public alertMessage;

	public genres;
	public otraOpcion: boolean;
	public newGenre: string;
	public genreSelected

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService

	) {
		this.titulo = 'Crear nuevo artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('', '', '', '');
		this.otraOpcion = false;
	}

	ngOnInit() {
		this.getGenres()
	}

	getGenres() {
		this._artistService.getGenres(this.token).subscribe(
			(response: any) => {
				this.genres = response.generos				
				if(response.generos.length>0){
					this.genreSelected =this.genres[0].description
				}
			}, this.errorFunc
		)

	}


	onSubmit() {
		//Si se crea un nuevo genero
		if (this.otraOpcion) {
			let newGenre = {description: this.newGenre}
			this._artistService.saveGenre(newGenre, this.token).subscribe(
				(response: any) => {
					if (!response.genre) {
						this.alertMessage = 'Error en el servidor';
					} else {
						this.artist.genre=response.genre._id
						this._artistService.addArtist(this.token, this.artist).subscribe(
							(response: any) => {
								console.log(response)
								if (!response.artist) {
									this.alertMessage = 'Error en el servidor';
								} else {
									this.alertMessage = '¡El artista se ha creado correctamente!';
									this.artist = response.artist;
									this._router.navigate(['/editar-artista', response.artist._id]);
								}
							}, this.errorFunc
						);
					}
				}, this.errorFunc
			)
		} else {
			this.artist.genre = this.getGenreId()
			this._artistService.addArtist(this.token, this.artist).subscribe(
				(response: any) => {
					console.log(response)
					if (!response.artist) {
						this.alertMessage = 'Error en el servidor';
					} else {
						this.alertMessage = '¡El artista se ha creado correctamente!';
						this.artist = response.artist;
						this._router.navigate(['/editar-artista', response.artist._id]);
					}
				}, this.errorFunc
			);
		}		
	}
	
	onChange(itemSelected) {
		if (itemSelected === "---- Otra opcion ----") {
			this.otraOpcion = true
		} else {
			if (this.otraOpcion) {
				this.otraOpcion = false
			}
		}
	}

	getGenreId(): string{
		let id = ""
		this.genres.forEach(element => {
			if(element.description = this.genreSelected){
				id = element._id
			}
		});
		return id
	}


	errorFunc(error) {
		var errorMessage = <any>error;
		if (errorMessage != null) {
			this.alertMessage = error.message;
			console.log(error);
		}
	}

}