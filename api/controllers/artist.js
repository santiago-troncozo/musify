const fs = require("fs")
const path = require("path")
const mongoosePaginate = require("mongoose-pagination")

var Artist = require("../models/artist")
var Album = require("../models/album")
var Song = require("../models/song")
var Genre = require("../models/genre")

function saveArtist(req, res) {
    const params = req.body
    const artist = new Artist({
        name: params.name,
        description: params.description,
        genre: params.genre,
        image: "Null",
    })
    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: "Error al guardar el artista..." })
        } else if (!artistStored) {
            res.status(404).send({ message: "El artista no ha sido guardado." })
        } else {
            res.status(200).send({ artist: artistStored })
        }
    })
}

function getArtist(req, res) {
    var artistId = req.params.id
    Artist.findById(artistId).populate({ path: "genre" }).exec((err, artist) => {
        if (err) {
            res.status(500).send({ message: "Hay un error en la peticion." })
        } else if (!artist) {
            res.status(404).send({ message: "El artista no existe." })
        } else {
            res.status(200).send({ artist })
        }
    })
}


//getArtists Devuelve el listado de todos los artistas de forma paginada
function getArtists(req, res) {
    if (req.params.page) {
        var page = req.params.page
    } else {
        var page = 1
    }
    const itemsPerPage = 4
    Artist.find().sort("name").populate({ path: "genre" }).paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion." })
        } else {
            if (!artists) {
                res.status(404).send({ message: "No hay artistas." })
            }
            return res.status(200).send({
                page: page,
                totalItems: total,
                artists: artists
            })
        }
    })
}


function updateArtist(req, res) {
    const artistId = req.params.id
    const changes = req.body
    Artist.findByIdAndUpdate(artistId, changes, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error al guardar el artista." })
        } else if (!artistUpdated) {
            res.status(404).send({ message: "El artista no ha sido actualizado." })
        }
        res.status(200).send({ artistUpdated: artistUpdated })
    })
}


function deleteArtist(req, res) {
    const artistId = req.params.id

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ message: "Error al eliminar el artista." })
        } else if (!artistRemoved) {
            res.status(404).send({ message: "El artista no ha sido eliminado." })
        } else {
            Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
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
                            res.status(200).send({ artist: artistRemoved })
                        }
                    })
                }
            })
        }
    })
}

function uploadImage(req, res) {
    const artistId = req.params.id
    let file_name = "No subido"
    if (req.files) {
        //Extraigo de la ruta del archivo el nombre del mismo
        var file_path = req.files.image.path
        var file_split = file_path.split("/")
        file_name = file_split[2]

        //Extraigo la extension del archivo y la estudio
        var ext_split = file_name.split(".")
        var file_ext = ext_split[1]

        if (file_ext === "png" || file_ext === "jpg" || file_ext === "gif" || file_ext === "jpeg") {
            //Si es correcta, actualizo los datos 
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdate) => {
                if (!artistUpdate) {
                    res.status(200).send({ message: "No se ha podido actualizar el usuario." })
                } else {
                    res.status(200).send({ user: artistUpdate })
                }
            })
        } else {
            res.status(200).send({ message: "Extension del archivo no valida." })
        }

    } else {
        res.status(200).send({ message: "No se ha subido ninguna imagen..." })
    }
}

//Muestro el avatar de un usuario. 
function getImageFile(req, res) {
    //Por parametro URL pasamos el nombre de archivo 
    var imageFile = req.params.imageFile
    var pathFile = "./uploads/artists/" + imageFile
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


function getArtistByName(req, res) {
    const order = req.body.order
    const name = req.body.name
    let find
    if (name) {
        if (order === "asc") {
            find = Artist.where({ name: new RegExp(name, 'i') }).sort({ name: 1 })
        } else {
            find = Artist.where({ name: new RegExp(name, 'i') }).sort({ name: -1 })
        }
        find.populate({ path: "genre" }).exec((err, artists) => {
            if (err) {
                res.status(500).send({ message: "Error en el servidor" })
            } else {
                res.status(200).send({ artists })
            }
        })
    } else {
        res.status(200).send({ message: "Ingrese palabras a buscar" })
    }
}


//FUNCIONES RELACIONADAS CON EL GENERO DEL ARTISTA
function getGenres(req, res) {
    Genre.find().sort("description").exec((err, genres) => {
        if (err) {
            return res.status(500).send({ message: "Error en el servidor" })
        }
        res.status(200).send({ generos: genres })
    })
}

function saveGenre(req, res) {
    const description = req.body.description
    const genre = new Genre({ description: description })
    genre.save((err, genreStored) => {
        if (err) {
            res.status(500).send({ message: "Error al guardar el genero..." })
        } else if (!genreStored) {
            res.status(404).send({ message: "El genero no ha sido guardado." })
        } else {
            res.status(200).send({ genre: genreStored })
        }
    })
}


function getArtistByGenre(req, res) {
    let page
    if (req.params.page) {
        page = req.params.page
    } else {
        page = 1
    }
    const itemsPerPage = 4
    const genre = req.params.genre

    Artist.find({ genre: genre }).sort("name").populate({ path: "genre" }).paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion." })
        } else {
            if (!artists) {
                res.status(404).send({ message: "No hay artistas." })
            }
            return res.status(200).send({
                page: page,
                totalItems: total,
                artists: artists
            })
        }
    })
}
module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile,
    getGenres,
    getArtistByName,
    saveGenre,
    getArtistByGenre
}