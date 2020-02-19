const express = require("express")
const multipart = require("connect-multiparty")
let api = express()
var md_upload = multipart({uploadDir: "./uploads/songs"})

const md_auth = require("../middlewares/authenticated")
const songController = require("../controllers/song")

api.get("/song/:id",md_auth.ensureAuth, songController.getSong)
api.get("/songs/:albumId?",md_auth.ensureAuth, songController.getSongs)
api.get("/get-song-file/:songFile",  songController.getSongFile)

api.post("/upload-file-song/:id", [md_auth.ensureAuth, md_upload], songController.uploadFile)
api.post("/search/song",md_auth.ensureAuth, songController.getSongByName)
api.post("/song",md_auth.ensureAuth, songController.saveSong)

api.put("/song/:id",md_auth.ensureAuth, songController.updateSong)

api.delete("/song/:id",md_auth.ensureAuth, songController.deleteSong)


module.exports = api