const fs = require("fs")
const path = require("path")
const mongoosePaginate = require("mongoose-pagination")

var Album = require("../models/album")
var Song = require("../models/song")

function getAlbum(req, res) {
    const albumId = req.params.id
    Album.findById(albumId).populate({ path: "artist" }).exec((err, album) => {
        if (err) {
            res.status(500).send({ message: "Error en el servidor." })
        } else if (!album) {
            res.status(404).send({ message: "Album inexistente." })
        } else {
            res.status(200).send({ album })
        }
    })
}

function saveAlbum(req, res) {
    const params = req.body
    const album = new Album()

    album.title = params.title
    album.description = params.description
    album.year = params.year
    album.image = "null"
    album.artist = params.artist

    album.save((err, albumStored) => {
        if (err) {
            return res.status(500).send({ message: "Error al guardar el album." })
        }
        if (!albumStored) {
            return res.status(404).send({ message: "No se ha guardado el album." })
        }
        res.status(200).send({ albumStored: album })
    })
}


function getAllAlbums(req, res) {
    Album.find().sort("artist").populate({ path: "artist" }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion." })
        } else if (!albums) {
            return res.status(404).send({ message: "No hay albums." })
        } else {
            return res.status(200).send({
                albums: albums
            })
        }
    })
}

function getAlbums(req, res) {
    console.log(req.params)
    const artistId = req.params.artist
    let page
    if (req.params.page) {
        page = req.params.page
    } else {
        page = 1
    }
    const itemsPerPage = 4
    //Sacar los albums de un artista concreto paginado
    Album.find({ artist: artistId }).sort("year").populate({ path: "artist" }).paginate(page, itemsPerPage, (err, albums, total) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion." })
        } else if (!albums) {
            return res.status(404).send({ message: "No hay albums." })
        } else {
            return res.status(200).send({
                page: page,
                totalItems: total,
                albums: albums
            })
        }
    })
}

function updateAlbum(req, res) {
    const albumId = req.params.id
    const changes = req.body
    Album.findByIdAndUpdate(albumId, changes, (err, albumUpdate) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion." })
        } else if (!albumUpdate) {
            return res.status(404).send({ message: "Error al actualizar el album" })
        } else {
            return res.status(200).send({ albumUpdate })
        }
    })
}

function deleteAlbum(req, res) {
    const albumId = req.params.id
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
            res.status(500).send({ message: "Error al eliminar el album." })
        } else if (!albumRemoved) {
            res.status(404).send({ message: "El album no ha sido eliminado." })
        } else {
            Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                if (err) {
                    res.status(500).send({ message: "Error al eliminar la cancion." })
                } else if (!songRemoved) {
                    res.status(404).send({ message: "La cancion no ha sido eliminado." })
                } else {
                    res.status(200).send({ albumRemoved })
                }
            })
        }
    })
}



function uploadImage(req, res) {
    var albumId = req.params.id
    var file_name = "No subido..."

    //Debido a que importamos el multipart se agrega a la req un campo files para el trabajo de archivos
    if (req.files) {
        //Extraigo de la ruta del archivo el nombre del mismo
        var file_path = req.files.image.path
        var file_split = file_path.split("/")
        console.log(file_split)
        file_name = file_split[2]

        //Extraigo la extension del archivo y la estudio
        var ext_split = file_name.split(".")
        var file_ext = ext_split[1]

        if (file_ext === "png" || file_ext === "jpg" || file_ext === "gif" || file_ext === "jpeg") {
            //Si es correcta, actualizo los datos 
            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdate) => {
                if (!albumUpdate) {
                    res.status(200).send({ message: "No se ha podido actualizar el usuario." })
                } else {
                    res.status(200).send({ album: albumUpdate })
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
function getImageFile(req, res) {
    //Por parametro URL pasamos el nombre de archivo 
    var imageFile = req.params.imageFile
    var pathFile = "./uploads/albums/" + imageFile
    //Usamos el paquete fs para evaluar la existencia del archivo
    fs.exists(pathFile, (exists) => {
        if (exists) {
            //Si existe devolver la imagen cruda 
            res.sendFile(path.resolve(pathFile))
        } else {
            res.status(200).send({ message: "No existe la imagen..." })
        }
    })
}


function getAlbumsByTitle(req, res) {
    const order = req.body.order
    const title = req.body.title
    if (title) {
        let find
        if (order === "asc") {
            find = Album.where({ title: new RegExp(title, 'i') }).sort({ title: 1 })
        } else {
            find = Album.where({ title: new RegExp(title, 'i') }).sort({ title: -1 })
        }
        find.populate({ path: "artist" }).exec((err, albums) => {
            if (err) {
                res.status(500).send({ message: "Error en el servidor" })
            } else {
                res.status(200).send({ albums })
            }
        })
    } else {
        res.status(200).send({ message: "Ingrese palabras a buscar" })
    }
}



function getAlbumsByGenre(req, res) {
    let page
    if (req.params.page) {
        page = req.params.page
    } else {
        page = 1
    }
    const itemsPerPage = 4
    const genre = req.params.genre
    let inicio = (page - 1) * itemsPerPage
    let fin = page * itemsPerPage - 1

    Album.find().sort("title").populate({ path: "artist" }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion." })
        } else {
            albums = albums.filter(album => album.artist.genre == genre)
            if (inicio < albums.length - 1) {
                if (fin > albums.length) {
                    fin = albums.length
                }
                return res.status(200).send({
                    page: page,
                    albums: albums.slice(inicio, fin)
                })
            } else {
                return res.status(200).send({
                    page: page,
                    albums: []
                })
            }

        }
    }

    )
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    deleteAlbum,
    uploadImage,
    getImageFile,
    getAlbumsByTitle,
    updateAlbum,
    getAlbumsByGenre,
    getAllAlbums
}
