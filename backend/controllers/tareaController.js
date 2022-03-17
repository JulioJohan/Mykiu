import Proyecto from "../models/Proyecto.js"
import Tarea from '../models/Tareas.js'

const agregarTarea = async(req,res)=>{
    const {proyecto} = req.body

    //Consultando si el proyecto existe
    const existeProyecto = await Proyecto.findById(proyecto)
    //verificando si el proyecto exist
    if(!existeProyecto){
        const error =  new Error ('El proyecto no existe')
        return res.status(404).json({msg: error.message})
    }
    //Verificando si el proyecto es del creador
    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error =  new Error ('No tienes permisos para anadir las tareas')
        return res.status(403).json({msg: error.message})
    }
    try{
        //Almacenando lo que el usuario nos proporciono y guardar la tarea
        const tareaAlmacenada = await Tarea.create(req.body)
        //Almacenar el ID del Proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save()
        res.json(tareaAlmacenada)
    }catch(error){
        console.log(error)
    }
}

const obtenerTarea = async(req,res)=>{
    //obtner la id de de la tarea
    const {id} = req.params
    //obteniedno la tarea y el que creo la tarea de ese proyecto
    const tarea = await Tarea.findById(id).populate('proyecto')
   
    //404 es cuando no encontraste la tarea
    if(!tarea){
        const error =  new Error ('Tarea no encontrado')
        return res.status(404).json({msg: error.message})      
    }
    //comprobando que sea del mismo usuario
    //comprobando que la taraa no haya creado
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error =  new Error ('accion no valida')
        return res.status(403).json({msg: error.message})   
    }
    res.json(tarea)
}

const actualizarTarea = async(req,res) => {
        //obtner la id de de la tarea
        const {id} = req.params
        //obteniedno la tarea y el que creo la tarea de ese proyecto
        const tarea = await Tarea.findById(id).populate('proyecto')
       
        //404 es cuando no encontraste la tarea
        if(!tarea){
            const error =  new Error ('Tarea no encontrad')
            return res.status(404).json({msg: error.message})      
        }
        //comprobando que sea del mismo usuario
        //comprobando que la taraa no haya creado
        if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
            const error =  new Error ('accion no valida')
            return res.status(403).json({msg: error.message})   
        }
        //asignando lo que el usuario esta poniendo en el formulario
        //o que se igual
        tarea.nombre = req.body.nombre || tarea.nombre
        tarea.descripcion = req.body.descripcion || tarea.descripcion
        tarea.prioridad = req.body.prioridad || tarea.prioridad
        tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega

        try{
            //Almacenando la tarea
            const tareaAlmacenada = await tarea.save()
            res.json(tareaAlmacenada)
        }catch(error){
            console.log(error)
        }
}   
const eliminarTarea = async (req, res)=>{
         //obtner la id de de la tarea
         const {id} = req.params
         //obteniedno la tarea y el que creo la tarea de ese proyecto
         const tarea = await Tarea.findById(id).populate('proyecto')
        
         //404 es cuando no encontraste la tarea
         if(!tarea){
             const error =  new Error ('Tarea no encontrada')
             return res.status(404).json({msg: error.message})      
         }
         //comprobando que sea del mismo usuario
         //comprobando que la taraa no haya creado
         if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
             const error =  new Error ('accion no valida')
             return res.status(403).json({msg: error.message})   
         }

         try{
             //Identificacion de la tarea asignado al proyecto
             const proyecto = await Proyecto.findById(tarea.proyecto)
            //pull para sacar las tareas
             proyecto.tareas.pull (tarea._id)
            //Promise puedes enviar diferentes awaits 
            //Elimina la referencia como esta en los proyectos como en las tareas
            await Promise.allSettled([ await proyecto.save(),await tarea.deleteOne() ])
            res.json({msg : 'La Tarea se Elimino'})
         }catch(error){
            console.log(error)
         }
         

}

const cambiarEstado = async (req, res) => {
    //Comprobaciones del servidor
     //obtner la id de de la tarea
     const {id} = req.params
     //obteniedno la tarea y el que creo la tarea de ese proyecto
     const tarea = await Tarea.findById(id).populate('proyecto') 
     //404 es cuando no encontraste la tarea
     if(!tarea){
         const error =  new Error ('Tarea no encontrada')
         return res.status(404).json({msg: error.message})      
     }
        //comprobando que sea del mismo usuario
         //comprobando que la taraa no haya creado
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && 
    !tarea.proyecto.colaboradores.some(
    (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    
    )
    ){
    const error =  new Error ('accion no valida')
    return res.status(403).json({msg: error.message})   
    }
    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id
    await tarea.save()

    const tareaAlmacenada = await Tarea.findById(id)
    .populate('proyecto')
    .populate('completado')

    res.json(tareaAlmacenada)

}

export{
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado 
}