const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const tareaController = require("../controllers/tareaController");

// crear una tarea
// /api/tareas
router.post(
  "/",
  auth,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("proyecto", "El proyecto es obligatorio").not().isEmpty(),
  ],
  tareaController.crearTareas
);

router.get(
    "/",
    auth,
    tareaController.listarTareas
  );

// Actualizara tarea
router.put(
    "/:id",
    auth,
    [
       check("proyecto", "Debes asignar el proyecto al cual pertenece").not().isEmpty(),
    ],
    tareaController.actualizarTarea
);

// Eliminar tarea
router.delete(
    "/:id",
    auth,
    tareaController.eliminarTarea
);




module.exports = router;
