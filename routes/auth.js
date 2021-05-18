// rutas para autentificar usuario
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check } = require("express-validator");

const authController = require("../controllers/authController");

// Identificar usuario
// /api/auth
router.post("/", authController.autentificarUsuario);

router.get("/", auth, authController.usuarioAutenticado);

module.exports = router;
