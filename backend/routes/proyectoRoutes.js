import express from 'express'

import {  obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
    
     } from '../controllers/proyectoController.js'
import checkAuth from '../middleware/checkAut.js'

const router = express.Router()

//Se poner get porque se obtendran los proyectos
//porque se va a poner nuevos proyectos con un formulario

//Obtener nuevo proyecto y poner formulario para poner nuevo proyecto
router.route('/')
.get(checkAuth, obtenerProyectos)
.post(checkAuth, nuevoProyecto)

//Verificando si tiene una id y cuando se comprobara y despues de obtener Proyecto
router.route('/:id')
//Revisara la utenticacion de nuevo
.get(checkAuth, obtenerProyecto)
//verificar id despues editar proyecto
.put(checkAuth,editarProyecto)
.delete(checkAuth,eliminarProyecto)

//id del proyecto
router.post('/colaboradores', checkAuth, buscarColaborador)
router.post('/colaboradores/:id',checkAuth, agregarColaborador)
router.post('/eliminar-colaborador/:id',checkAuth, eliminarColaborador )
export default router;