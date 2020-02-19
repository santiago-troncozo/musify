var mongoose = require("mongoose")

var genreSchema = new mongoose.Schema({
    description: String
})

const Genre = mongoose.model("Genre", genreSchema)

module.exports = Genre