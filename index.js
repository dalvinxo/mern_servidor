const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor
const server = express();

//conectar base de datos
conectarDB();

// habilitar cors
server.use(cors());


//habilitar express.json
server.use(express.json({ extended: true}));

//puerto de la app
const port = process.env.PORT || 4000;

//importar rutas
server.use('/api/usuarios', require('./routes/usuarios'));
server.use('/api/auth', require('./routes/auth'));
server.use('/api/proyectos', require('./routes/proyectos'));
server.use('/api/tareas', require('./routes/tareas'));

//arrancar la app
server.listen(port,'0.0.0.0', ()=>{
    console.log(`El servidor esta funcionando en el puerto ${port}`)
}) 