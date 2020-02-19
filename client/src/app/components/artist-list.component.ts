import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-list',
	templateUrl: '../views/artist-list.html',
	providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
	private titulo: string;
	private artists: Artist[];
	private identity;
	private token;
	private url: string;
	private next_page;
	private prev_page;
	private actualPage
	private genres
	public genreSelected

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _artistService: ArtistService,
		private _userService: UserService
	) {
		this.titulo = 'Artistas'
		this.identity = this._userService.getIdentity()
		this.token = this._userService.getToken()
		this.url = GLOBAL.url
		this.next_page = 1
		this.prev_page = 1
	}

	ngOnInit() {
		//Obtengo primero los generos
		this._artistService.getGenres(this.token).toPromise().then(
			(response: any) => {
				this.genres = response.generos
				if (response.generos.length > 0) {
					this.genreSelected = this.genres[0].description
				}
			}).then(() => {
				this.getArtists()
			})
	}


	getArtists() {
		this._route.params.subscribe((params: Params) => {
			this.actualPage = +params['page'];
			if (!this.actualPage) {
				this.actualPage = 1;
			} else {
				this.next_page = this.actualPage + 1;
				this.prev_page = this.actualPage - 1;

				if (this.prev_page == 0) {
					this.prev_page = 1;
				}
			}
			this._route.queryParams.subscribe((qparams: Params) => {
				let genre = qparams.genre
				if (!genre) {
					this.genreSelected = "Todos los generos"
					this._artistService.getArtists(this.token, this.actualPage).subscribe(
						(response: any) => {
							if (!response.artists) {
								this._router.navigate(['/']);
							} else {
								this.artists = response.artists;
							}
						}, this.errorFunc
					);
				} else {
					this.genreSelected = genre
					this.filter(this.getGenreId(this.genreSelected), this.actualPage)
				}
			})

		});
	}

	public confirmado;
	onDeleteConfirm(id) {
		this.confirmado = id;
	}

	onCancelArtist() {
		this.confirmado = null;
	}

	onDeleteArtist(id) {
		this._artistService.deleteArtist(this.token, id).subscribe(
			(response: any) => {
				if (!response.artist) {
					alert('Error en el servidor');
				}
				this.getArtists();
			}, this.errorFunc
		);
	}

	filter(genreId, page) {
		if (this.genreSelected != "Todos los generos") {
			this._artistService.getArtistByGenre(genreId, page, this.token).subscribe(
				(response: any) => {
					if (!response.artists) {
						alert('Error en el servidor');
					}
					this.artists = response.artists
				}, this.errorFunc
			)
		}
	}

	onChange() {
		if (this.genreSelected === "Todos los generos") {
			this._router.navigate(['/artistas/' + this.actualPage]);
		} else {
			this._router.navigate(['/artistas/' + this.actualPage], { queryParams: { genre: this.genreSelected } });
		}
	}

	onClick(opt) {
		const id = opt.srcElement.id
		if (this.genreSelected === "Todos los generos") {
			if (id === "prev") {
				this._router.navigate(['/artistas/' + this.prev_page])
			} else {
				this._router.navigate(['/artistas/' + this.next_page])
			}
		}else{
			if (id === "prev") {
				this._router.navigate(['/artistas/' + this.prev_page], { queryParams: { genre: this.genreSelected } })
			} else {
				this._router.navigate(['/artistas/' + this.next_page], { queryParams: { genre: this.genreSelected } })
			}
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