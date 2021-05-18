const { validationResult } = require("express-validator");
const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");

//crea una nueva tarea
exports.crearTareas = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { proyecto } = req.body;

    const proyectoExits = await Proyecto.findById(proyecto);
    if (!proyectoExits) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //verificar el creador del proyecto actual es del usuario autentificado
    if (proyectoExits.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Obtiene las tareas por proyecto
exports.listarTareas = async (req, res) => {
  try {
    const { proyecto } = req.query;

    const proyectoExits = await Proyecto.findById(proyecto).sort({creado: -1});

    if (!proyectoExits) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //verificar el creador del proyecto actual es del usuario autentificado
    if (proyectoExits.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    // Obtener las tareas por proyecto
    const tareas = await Tarea.find({ proyecto });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { proyecto, nombre, estado } = req.body;

    //Si la tarea existe verificacion
    let tareaExists = await Tarea.findById(req.params.id);

    if (!tareaExists) {
      return res.status(404).json({ msg: "No existe esa tarea" });
    }

    // extraer proyecto
    const proyectoExits = await Proyecto.findById(proyecto);

    //verificar el creador del proyecto actual es del usuario autentificado
    if (proyectoExits.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //  Crear un objeto con la nueva información
    const nuevaTarea = {};
    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;

    //Guardar tarea
    tareaExists = await Tarea.findByIdAndUpdate(
      { _id: req.params.id },
      nuevaTarea,
      { new: true }
    );

    res.json({ tareaExists });

    if (nombre) {
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Hubo un error");
  }
};

exports.eliminarTarea = async (req, res) => {

  try {
    const { proyecto } = req.query;

    //Si la tarea existe verificacion
    let tareaExists = await Tarea.findById(req.params.id);

    if (!tareaExists) {
      return res.status(404).json({ msg: "No existe esa tarea" });
    }

    // extraer proyecto
    const proyectoExits = await Proyecto.findById(proyecto);

    //verificar el creador del proyecto actual es del usuario autentificado
    if (proyectoExits.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Eliminar
    await Tarea.findOneAndRemove({_id: req.params.id});
    res.json({msg: 'Tarea Eliminada'})


  } catch (error) {

    console.log(error);
    return res.status(500).send("Hubo un error");
    
  }



};
