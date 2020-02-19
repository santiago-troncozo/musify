var express = require("express")
var UserController = require("../controllers/user") 
var md_auth = require("../middlewares/authenticated")
var api = express.Router()

var multipart = require("connect-multiparty")
//md_upload es un middleware que nos permite trabajar con los ficheros
//uploadDir: ruta especifico donde se van a guardar los avatars de los usuarios

var md_upload = multipart({ uploadDir: "./uploads/users"}) 

api.get("/probando-controlador", md_auth.ensureAuth , UserController.prueba)
api.get("/get-image-user/:imageFile",  UserController.getImageFile)

api.put("/update-user/:id", md_auth.ensureAuth, UserController.updateUser)

api.post("/register",UserController.saveUser)
api.post("/login",UserController.loginUser)
api.post("/upload-image-user/:id", [md_auth.ensureAuth, md_upload], UserController.uploadImage)

module.exports = api
