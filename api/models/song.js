var mongoose = require("mongoose")
var schema = mongoose.Schema


var songSchema = schema({
    number: Number, 
    name: String,
    duration: String,
    file: String,
    album: { type: schema.ObjectId , ref: "Album"}
})


module.exports = mongoose.model("Song", songSchema)

