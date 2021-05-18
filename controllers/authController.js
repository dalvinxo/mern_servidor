const Usuario = require("../models/Usuarios");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.autentificarUsuario = async (req, res) => {
  //revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    // revisando que el usuario existe
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    // Revisar el password
    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: "password incorrecto" });
    }

    // usuario correcto; crear y firmar el jwt
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    // firmar el jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;

        // mensaje de confirmacion
        res.json({ token: token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};


exports.usuarioAutenticado = async (req, res) => {

    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json(usuario);

    } catch (error) {
      console.log(error);
      res.status(500).json({msg: 'Hubo un error'})
    }


}
