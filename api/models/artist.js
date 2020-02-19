var mongoose = require("mongoose")
var schema = mongoose.Schema

var artistSchema = new mongoose.Schema({
    name: String,
    description:String,
    image: String,
    genre: { type: schema.ObjectId, ref: "Genre" }
})

const Artist = mongoose.model("Artist", artistSchema)

module.exports = Artist