//Importando el routing
import express from 'express'
import {agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado} from '../controllers/tareaController.js'
    import checkAut from '../middleware/checkAut.js'
const router = express.Router()

router.post('/', checkAut, agregarTarea)
router.
    route('/:id')
    .get(checkAut,obtenerTarea)
    .put(checkAut,actualizarTarea)
    .delete(checkAut,eliminarTarea)
router.post('/estado/:id',checkAut,cambiarEstado) 
export default router