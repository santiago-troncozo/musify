var jwt = require("jwt-simple")
var moment = require("moment")
var secret = "clave_secrete_curso"

//Esta funcion se ejecuta antes de que se ejecute la accion del controlador
//Permite comprobar si los datos del token son correctos
exports.ensureAuth = function (req, res, next){
    //Estudiamos el campo auhorization del header de la peticion el cual guarda el token del que pertenece 
    //al usuario
    if(!req.headers.authorization){
        return res.status(403).send({ message: "La petición no tiene la cabecera de autenticación."})
    }
    //Guardamos el token y le extraemos las comillas en caso de que las tenga
    
    var token = req.headers.authorization.replace(/['"]+/g, "")
    
    try{
        //Decodificamos la informacion del token y lo guardamos en la variable payload 
        var payload = jwt.decode(token,secret)
   
        //Verificamos que no haya expirado
        if(payload.exp <= moment.unix()){
            return res.status(401).send({ message: "El token ha expirado."})
        }
    }catch(ex){
        res.status(404).send({ message: "Token no valido."})
    }
    //Agregamos a la request un campo denominado user que guardara la informacion del mismo
    req.user = payload
    //Salimos del middleware
    next()
}