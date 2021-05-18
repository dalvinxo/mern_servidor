const Usuario = require("../models/Usuarios");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  //revisar si hay errores
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  //Destructing email y password
  const { email, password } = req.body;

  try {
    // Revisar que el usuario registrado sea unico
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: "Ese usuario ya existe." });
    }

    //crear el nuevo usuario
    usuario = new Usuario(req.body);

    //crear un hashend al password usuario
    //este metodo hash( contraseña, (la sal que generamos))
    const salt = await bcryptjs.genSalt(12);
    usuario.password = await bcryptjs.hash(password, salt);

    //guardar el nuevo usuario
    await usuario.save();

    //crear y firmar el jwt
    const payload = {

        usuario:{
            id: usuario.id
        }
     
    };

    // firmar el jwt
    jwt.sign(payload, process.env.SECRETA,{
        expiresIn: 3600,
      }, (error, token) => {

        if (error) throw error;

        // mensaje de confirmacion
        res.json({ token: token });
      }
    );

    //Mensaje de confirmación
    //return res.json({ msg: "Usuario creado correctamente..." });
  } catch (error) {
    console.log(error);
    res.send(400).send("Hubo un error");
  }
};
