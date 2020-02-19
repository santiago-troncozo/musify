var mongoose = require("mongoose")
var app = require("./app")

var port = process.env.PORT || 3977

mongoose.connect("mongodb://localhost:27017/curso-2", { useNewUrlParser: true , useUnifiedTopology: true },(err, res) => {
    if (err)
    {
        throw err
    }else
    {
        console.log("La base de datos es esta funcionando correctamente...")
        app.listen(port, function(){
            console.log("Servidor de API Rest de musica escuchando en http://localhost:"+port)       
        })
    }
})