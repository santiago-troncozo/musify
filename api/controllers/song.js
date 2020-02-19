const fs = require("fs")
const path = require("path")
const mongoosePaginate = require("mongoose-pagination")

var Artist = require("../models/artist")
var Album = require("../models/album")
var Song = require("../models/song")


function getSong(req, res) {
    const songId = req.params.id
    Song.findById(songId).populate({ path: "album" }).exec((err, song) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion" })
        } else if (!song) {
            res.status(404).send({ message: "Cancion inexistente" })
        } else {
            res.status(200).send({ song })
        }
    })
}


function saveSong(req, res) {
    const params = req.body
    var song = new Song({
        number: params.number,
        name: params.name,
        duration: params.duration,
        file: "Null",
        album: params.album
    })

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({ message: "Error al guardar la canción." })
        } else if (!songStored) {
            res.status(404).send({ message: "La canción no ha sido guardada." })
        } else {
            res.status(200).send({ song: songStored })
        }
    })
}

function getSongs(req, res) {
    const albumId = req.params.albumId
    if (!albumId) {
        var find = Song.find().sort("number")
    } else {
        var find = Song.find({ album: albumId }).sort("number")
    }

    find.populate({
        path: "album",
        populate: {
            path: "artist",
            model: "Artist"
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion" })
        } else if (!songs) {
            res.status(404).send({ message: "No hay canciones" })
        } else {
            res.status(200).send({ songs })
        }
    })
}


function updateSong(req, res) {
    const songId = req.params.id
    const changes = req.body
    console.log(req.body)
    Song.findByIdAndUpdate(songId, changes, (err, songUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error en el servidor." })
        } else if (!songUpdated) {
            res.status(404).send({ message: "No se ha actualizado la cancion." })
        } else {
            res.status(200).send({ song: songUpdated })
        }
    })
}


function deleteSong(req, res) {
    const songId = req.params.id
    Song.findOneAndRemove(songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({ message: "Error en el servidor." })
        } else if (!songRemoved) {
            res.status(404).send({ message: "No se ha eliminado la cancion." })
        } else {
            res.status(200).send({ song: songRemoved })
        }
    })
}


function uploadFile(req, res) {
    var songId = req.params.id
    var file_name = "No subido..."

    //Debido a que importamos el multipart se agrega a la req un campo files para el trabajo de archivos
    if (req.files) {
        //Extraigo de la ruta del archivo el nombre del mismo
        var file_path = req.files.file.path
        var file_split = file_path.split("/")
        console.log(file_split)
        file_name = file_split[2]

        //Extraigo la extension del archivo y la estudio
        var ext_split = file_name.split(".")
        var file_ext = ext_split[1]

        if (file_ext === "mp3" || file_ext === "ogg") {
            //Si es correcta, actualizo los datos 
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdate) => {
                if (!songUpdate) {
                    res.status(200).send({ message: "No se ha podido actualizar la cancion." })
                } else {
                    res.status(200).send({ song: songUpdate })
                }
            })
        } else {
            res.status(200).send({ message: "Extension del archivo no valida." })
        }
        console.log(file_path)
    } else {
        res.status(200).send({ message: "No se ha subido ninguna imagen..." })
    }
}

//Muestro el avatar de un usuario. 
function getSongFile(req, res) {
    //Por parametro URL pasamos el nombre de archivo 
    var songFile = req.params.songFile
    var pathFile = "./uploads/songs/" + songFile
    //Usamos el paquete fs para evaluar la existencia del archivo
    fs.exists(pathFile, (exists) => {
        if (exists) {
            //Si existe devolver la imagen cruda 
            res.sendFile(path.resolve(pathFile))
        } else {
            res.status(200).send({ message: "No existe el fichero de audio..." })
        }
    })
}


function getSongByName(req, res) {
    const order = req.body.order
    const name = req.body.name
    if (name) {
        let find
        if (order === "asc") {
            find = Song.where({ name: new RegExp(name, 'i') }).sort({ name: 1 })
        } else {
            find = Song.where({ name: new RegExp(name, 'i') }).sort({ name: -1 })
        }
        find.populate({
            path: "album",
            populate: {
                path: "artist",
                model: "Artist"
            }}).exec((err, songs) => {
            if (err) {
                res.status(500).send({ message: "Error en el servidor" })
            } else {
                res.status(200).send({ songs })
            }
        })
    }else{
        res.status(200).send({message: "Ingrese palabras a buscar"})
    }
}


module.exports = {
    getSong,
    getSongs,
    saveSong,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile,
    getSongByName
}
