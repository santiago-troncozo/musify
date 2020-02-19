import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';

@Component({
	selector: 'artist-detail',
	templateUrl: '../views/artist-detail.html',
	providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
	private artist: Artist;
	private albums: Album[];
	private identity;
	private token;
	private url: string;
	private alertMessage;
	private prev_page
	private next_page
	private actualPage
	private artistId
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _albumService: AlbumService
	) {
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit() {
		this.getArtist();
	}

	getArtist() {
		this._route.params.subscribe((params: Params) => {
			let id = params['id'];
			this.artistId = id
			this.actualPage = +params['page'];
			if (!this.actualPage) {
				this.actualPage = 1;
				this.prev_page = 1;
				this.next_page = 2
			} else {
				this.next_page = this.actualPage + 1;
				this.prev_page = this.actualPage - 1;

				if (this.prev_page == 0) {
					this.prev_page = 1;
				}
			}
			this._artistService.getArtist(this.token, id).subscribe(
				(response: any) => {
					if (!response.artist) {
						this._router.navigate(['/']);
					} else {
						this.artist = response.artist;
						// Sacar los albums del artista
						this._albumService.getAlbums(this.token, this.actualPage, response.artist._id).subscribe(
							(response: any) => {
								if (!response.albums) {
									this.alertMessage = 'Este artista no tiene albums';
								} else {
									this.albums = response.albums;
								}
							},
							error => {
								var errorMessage = <any>error;
								if (errorMessage != null) {
									console.log(error.message);
								}
							});
					}
				},
				error => {
					var errorMessage = <any>error;

					if (errorMessage != null) {
						console.log(error.message);
					}
				}
			);

		});
	}

	public confirmado;
	onDeleteConfirm(id) {
		this.confirmado = id;
	}

	onCancelAlbum() {
		this.confirmado = null;
	}

	onDeleteAlbum(id) {
		this._albumService.deleteAlbum(this.token, id).subscribe(
			(response: any) => {
				if (!response.album) {
					alert('Error en el servidor');
				}

				this.getArtist();
			},
			error => {
				var errorMessage = <any>error;

				if (errorMessage != null) {
					var body = JSON.parse(error._body);
					//this.alertMessage = body.message;

					console.log(error);
				}
			}
		);
	}

	onClick(opt) {
		const id = opt.srcElement.id
		if (id === "prev") {
			this._router.navigate(['/artista/' + this.artistId + "/" + this.prev_page])
		} else {
			this._router.navigate(['/artista/' + this.artistId + "/" + this.next_page])
		}
	}
}