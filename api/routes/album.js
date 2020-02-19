const express = require("express")
const albumController = require("../controllers/album")

const api = express()
const md_auth = require("../middlewares/authenticated")
const multipart = require("connect-multiparty")
const md_upload = multipart({uploadDir: "./uploads/albums"})

api.get("/album/:id", md_auth.ensureAuth, albumController.getAlbum)
api.get("/get-all-albums/",md_auth.ensureAuth, albumController.getAllAlbums)
api.get("/albums/:artist/:page?",md_auth.ensureAuth, albumController.getAlbums)
api.get("/get-image-album/:imageFile",  albumController.getImageFile)
api.get("/filter-albums/:genre/:page?", md_auth.ensureAuth, albumController.getAlbumsByGenre)

api.put("/album/:id", md_auth.ensureAuth, albumController.updateAlbum)

api.post("/upload-image-album/:id", [md_auth.ensureAuth, md_upload], albumController.uploadImage)
api.post("/album", md_auth.ensureAuth, albumController.saveAlbum)
api.post("/search/album",md_auth.ensureAuth, albumController.getAlbumsByTitle)

api.delete("/album/:id",md_auth.ensureAuth, albumController.deleteAlbum)



module.exports = api 
