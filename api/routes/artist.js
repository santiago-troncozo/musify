var express = require("express")
var artistController = require("../controllers/artist")

var api = express()
var md_auth = require("../middlewares/authenticated")

var multipart = require("connect-multiparty")
//md_upload es un middleware que nos permite trabajar con los ficheros
//uploadDir: ruta especifico donde se van a guardar la imagen de un artista
var md_upload = multipart({ uploadDir: "./uploads/artists"}) 



api.get("/artist", md_auth.ensureAuth, artistController.getArtist)
api.get("/artists/:page?", md_auth.ensureAuth, artistController.getArtists)
api.get("/artist/:id", md_auth.ensureAuth, artistController.getArtist)
api.get("/get-image-artist/:imageFile",  artistController.getImageFile)
api.get("/artist-genres",md_auth.ensureAuth, artistController.getGenres)
api.get("/filter-artist/:genre/:page", md_auth.ensureAuth, artistController.getArtistByGenre)

api.post("/artist", md_auth.ensureAuth, artistController.saveArtist)
api.post("/uploads-image-artist/:id",[md_auth.ensureAuth, md_upload], artistController.uploadImage)
api.post("/search/artist",md_auth.ensureAuth,artistController.getArtistByName)
api.post("/save-genre", md_auth.ensureAuth, artistController.saveGenre)

api.put("/artist/:id",md_auth.ensureAuth, artistController.updateArtist)

api.delete("/artist/:id",md_auth.ensureAuth, artistController.deleteArtist)

module.exports = api