var bcrypt = require("bcrypt-nodejs")
var User = require("../models/user")
var jwt = require("../services/jwt")
var fs = require("fs")
var path = require("path")

function prueba(req, res){
    res.status(200).send("Probando una accion del controlador de usuario.")
}

function saveUser(req, res){
    var user = new User()
    var params = req.body
    user.name = params.name
    user.surname = params.surname
    user.email = params.email
    user.role = params.role
    user.image = "null"

    
    if(params.password){
        //Encriptamos la contraseña 
        bcrypt.hash(params.password, null, null, (err,hash) =>{
            user.password = hash
            //Consultamos si se cargaron todos los datos
            if(user.name != null && user.surname != null && user.email != null){
                //GUARDAMOS EL USUARIO 
                user.save(( err, userStored )=>{
                    if(err){
                        res.status(500).send({ message: "Error al guardar el usuario"})
                    }else{
                        if(!userStored){
                            res.status(404).send({ message: "No se ha registrado el usuario" })
                            console.log("ERROR")
                        }else{
                            res.status(200).send({user: userStored})
                        }
                    }
                }) 
            }else{
                res.status(200).send({message: "Rellena todos los campos"})        
            }
        })
    }else{
        res.status(200).send({message: "Introduce la contraseña"})
    }
}

function loginUser(req, res){
    const params = req.body
    const email = params.email
    const password = params.password

    //Validamos el usuario
    User.findOne({email: email}, (err, user) => {
        if(err){
            res.status(500).send({ message: "Error en la petición." })
        }else if(!user){
            res.status(404).send({ message: "El usuario no existe."})
        }else{
            //Comparamos la contraseña
            bcrypt.compare(password,user.password,(err, check)=>{
                if(check){
                    //Devolver los datos del usuario logeado

                    if(params.getHash){
                        //Devolver un token de jwt
                        let tok = jwt.createToken(user)
                        res.status(200).send({
                            token: tok
                        })
                    }else{
                        res.status(200).send({user})
                    }
                }else{
                    res.status(404).send({ message: "El usuario no ha podido loguearse"})
                }
            })
        }
    })


    
}


//Actualizar los datos de un usuario
function updateUser(req, res){
    //Tomo el id del usuario que quiero actualizar por parametro de la url
    var userId = req.params.id
    //Guardo los cambios pasados por PUT 
    var update = req.body

    if(userId != req.user.sub){
        return res.status(500).send({ message: "No tienes permiso para actualizar este usuario."})
    }
    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if(err){
            res.status(500).send({ message: "Error al actualizar el usuario."})
        }else{
            if(!userUpdate){
                res.status(404).send({ message: "No se ha podido actualizar el usuario."})
            }else{
                res.status(200).send({user: userUpdate})
            }
        }
    })
}

//Subir imagen de usuario 
function uploadImage(req, res){
    var userId = req.params.id 
    var file_name = "No subido..."

    //Debido a que importamos el multipart se agrega a la req un campo files para el trabajo de archivos
    if(req.files){
        //Extraigo de la ruta del archivo el nombre del mismo
        var file_path = req.files.image.path
        var file_split = file_path.split("/")
        file_name = file_split[2]

        //Extraigo la extension del archivo y la estudio
        var ext_split = file_name.split(".")
        var file_ext = ext_split[1]
        
        if(file_ext === "png" || file_ext === "jpg" || file_ext === "gif"){
            //Si es correcta, actualizo los datos 
            User.findByIdAndUpdate(userId, {image : file_name} , (err, userUpdated) =>{
                if(!userUpdated){
                    res.status(200).send({ message: "No se ha podido actualizar el usuario."})
                }else{
                    res.status(200).send({ image: file_name, user: userUpdated})        
                }
            })
        } else {
            res.status(200).send({ message: "Extension del archivo no valida."})
        }
    }else{
        res.status(200).send({ message: "No se ha subido ninguna imagen..."})
    }
}

//Muestro el avatar de un usuario. 
function getImageFile(req, res){
    //Por parametro URL pasamos el nombre de archivo 
    var imageFile = req.params.imageFile
    var pathFile = "./uploads/users/" + imageFile 
    //Usamos el paquete fs para evaluar la existencia del archivo
    fs.exists(pathFile, (exists)=>{
        if(exists){
            //Si existe devolver la imagen cruda 
            res.sendFile(path.resolve(pathFile))
        }else{
            res.status(200).send({message: "No existe la imagen..."})
        }
    })
}



module.exports = {
    saveUser,
    loginUser,
    updateUser,
    prueba,
    uploadImage,
    getImageFile
}
