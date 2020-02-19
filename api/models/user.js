
const mongoose = require("mongoose")
var userSchema =  mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
})

const User = mongoose.model("User", userSchema)

module.exports = User