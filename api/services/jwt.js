var jwt = require("jwt-simple")
var moment = require("moment")
var secret = "clave_secrete_curso"

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname:user.surname,
        email: user.email, 
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }
    const token =jwt.encode(payload, secret)
     
    return token 
}