const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//password: 6BB5Rnj4BS0PxCzn
//password_user: T24ZXiqeMOw7H1Xq

// crear el servidor
const server = express();

//conectar base de datos
conectarDB();

// habilitar cors
server.use(cors());


//habilitar express.json
server.use(express.json({ extended: true}));

//puerto de la app
const port = process.env.port || 4000;

//importar rutas
server.use('/api/usuarios', require('./routes/usuarios'));
server.use('/api/auth', require('./routes/auth'));
server.use('/api/proyectos', require('./routes/proyectos'));
server.use('/api/tareas', require('./routes/tareas'));



// // Definir la página principal
// server.get('/', (req,res) =>{
//     res.send('desde la pagina principal')
// });

//arrancar la app
server.listen(port,'0.0.0.0', ()=>{
    console.log(`El servidor esta funcionando en el puerto ${port}`)
}) 