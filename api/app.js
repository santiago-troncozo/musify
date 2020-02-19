var express = require("express")
var bodyParser = require("body-parser")
var app = express();


//Configuraciones del bodyparser
//app.use(bodyParser.urlencoded({extended:true}))
//app.use(bodyParser.json())


//Cargar rutas
const user_routes = require("./routes/user")
const artist_routes = require("./routes/artist")
const album_routes = require("./routes/album")
const song_routes = require("./routes/song")
//Configurar cabeceras http

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});


//prueba
app.use(
  bodyParser.raw({ type : 'application/x-www-form-urlencoded' }),
  function(req, res, next) {
    try {
      req.body = JSON.parse(req.body)
    } catch(e) {
      req.body = require('qs').parse(req.body.toString());
    }
    next();
  }
);
//Rutas base
//MiddleWord api: para que cada vez que queramos acceder a una ruta
// debamos anteponer la ruta /api/
app.use("/api", user_routes)
app.use("/api", artist_routes)
app.use("/api", album_routes)
app.use("/api", song_routes)

//exportamos el modulo app para otros ficheros que necesiten de express
module.exports = app;