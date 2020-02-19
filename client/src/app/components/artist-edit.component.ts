import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-edit',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
	public titulo: string;
	public artist
	public identity;
	public token;
	public url: string;
	public alertMessage;
	public is_edit;

	public otraOpcion: boolean;
	public genres;
	public newGenre: string;
	public genreSelected

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _uploadService: UploadService,
		private _artistService: ArtistService
	) {
		this.titulo = 'Editar artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('', '', '', '');
		this.is_edit = true;
	}

	ngOnInit() {
		this.getArtist();
	}

	getGenres() {
		this._artistService.getGenres(this.token).subscribe(
			(response: any) => {
				this.genres = response.generos
				this.genres.forEach(element => {
					if (element._id === this.artist.genre._id) {
						this.genreSelected = element.description
					}
				});
			}, this.errorFunc
		)
	}
	getArtist() {
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			this._artistService.getArtist(this.token, id).subscribe(
				(response: any) => {
					if (!response.artist) {
						this._router.navigate(['/']);
					} else {
						this.artist = response.artist;
						this.getGenres()
					}
				}, this.errorFunc
			)
		});
	}


	onSubmit() {
		if (this.otraOpcion) {
			let newGenre = { description: this.newGenre }
			this._artistService.saveGenre(newGenre, this.token).subscribe(
				(response: any) => {
					if (!response.genre) {
						this.alertMessage = 'Error en el servidor';
					} else {
						this.artist.genre = response.genre._id
					}
				}, this.errorFunc
			)
		} else {
			this.getGenreId()
		}
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			this._artistService.editArtist(this.token, id, this.artist).subscribe(
				(response: any) => {
					if (!response.artistUpdated) {
						this.alertMessage = 'Error en el servidor';
					} else {
						this.alertMessage = '¡El artista se ha actualizado correctamente!';
						if (!this.filesToUpload) {
							this._router.navigate(['/artista', id]);
						} else {
							//Subir la imagen del artista
							this._uploadService.makeFileRequest(this.url + 'uploads-image-artist/' + id, [], this.filesToUpload, this.token, 'image').then(
								(result: any) => {
									this.artist.image = result.image
									this._router.navigate(['/artista', response.artistUpdated._id]);
								},
								(error) => {
									console.log(error);
								}
							);
						}
					}
				}, this.errorFunc
			)
		});
	}




	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}



	errorFunc(error) {
		var errorMessage = <any>error;
		if (errorMessage != null) {
			this.alertMessage = error.message;
			console.log(error);
		}
	}


	//Funciones relacionadas con el genero

	onChange(itemSelected) {
		if (itemSelected === "---- Otra opcion ----") {
			//Muestro el campo newGenre 
			this.otraOpcion = true
		} else {
			if (this.otraOpcion) {
				this.otraOpcion = false
			}
		}
	}


	getGenreId() {
		this.genres.forEach(genre => {
			if (genre.description === this.genreSelected) {
				this.artist.genre = genre._id
			}
		});
	}
}