import { useState, useEffect, createContext } from "react";
//Para redirigir hacia otra url
import { useNavigate } from "react-router-dom";
//importacion para redireccionar
import clienteAxios from "../config/clienteAxios";


const ProyectosContext = createContext();

//Estableciendo proyecto
const ProyectosProvider = ({children}) =>{
    //Proyectos sera un arreglo
    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState({})
    //proyecto es un objeto
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    //Modal para el formulario de las tareas
    const [modalFormularioTarea , setModalFormularioTarea] = useState(false)

    const [tarea,setTarea] = useState({})
    //Establciendo el metodo para dirgir al usuario o ootra url
    const [modalEliminarTarea ,setModalEliminarTarea] = useState(false)
    const navigate = useNavigate()

    useEffect(()=> {
        const obtenerProyectos = async () => {
            setCargando(true)
            try{
                    //Comprobacion del token
                const token = localStorage.getItem('token')
                if(!token) return

                //configuracion del token
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                }
            }
            //Enviando al backend
            const {data} = await clienteAxios.get('/proyectos',config)
            setProyectos(data)
                
            }catch(error){
                console.log(error)
            }finally{
                setCargando(false)
            }
        }
        obtenerProyectos()
    },[])

    //Funcion para la alerta
    const mostrarAlerta = alerta =>{
        setAlerta(alerta)
        //Se reinicia el objeto, la alerta desaparecera despues de cinco segundos
        setTimeout(()=>{
            setAlerta({})
        },5000)
    }

    const submitProyecto = async proyecto =>{

        //Verficando si es editar proyecto o un nuevo Proyecto
        if(proyecto.id){
            await editarProyecto(proyecto)
        }else{
            await nuevoProyecto(proyecto)
        }
    }

    const editarProyecto = async proyecto => {
        try{
            //Verificacion del token
            const token = localStorage.getItem('token')
            if(!token) return

            //configuracion del token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            //Enviando a la base de datos el proyecto con su misma id
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
        //Sincronizar el state
        const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
        setProyectos(proyectosActualizados)
        //Redireccionar 

        //Mostrar la alerta
        setAlerta({
            msg: 'Proyecto Actualizado Correctamente',
            error: false
        })
        //Redirigiendo a la pagina de proyectos
        setTimeout(()=>{
            //Reiniciamos alerta
            setAlerta({})
            navigate('/proyectos')
        },3000)

        }catch(error){
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto => {
        try{
            //Comprobacion del token
            const token = localStorage.getItem('token')
            if(!token) return

            //configuracion del token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            //enviando ala backend
            const {data} = await clienteAxios.post('/proyectos',proyecto, config)
            // Sincronizando con la API
            //Copia de los proyectos
            //Sincronia del state
            setProyectos([...proyectos ,data])

            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })
            //Redirigiendo a la pagina de proyectos
            setTimeout(()=>{
                setAlerta({})
                navigate('/proyectos')
            },3000)
        }catch(error){
            console.log(error)
        }
    }
const obtenerProyecto = async id => {
    try{
         //Comprobacion del token
         const token = localStorage.getItem('token')
         if(!token) return

         //configuracion del token
         const config = {
             headers: {
                 "Content-Type": "application/json",
                 Authorization: `Bearer ${token}`
             }
         }
        const {data} = await clienteAxios.get(`/proyectos/${id}`, config )
         setProyecto(data)
    }catch (error){
            console.log(error)
        } finally{
            setCargando(false)
        }

    }

    const eliminarProyecto = async id => {
        try{
                //Comprobacion del token
                const token = localStorage.getItem('token')
                if(!token) return
    
                //configuracion del token
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                //enviando ala backend
                const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)
                //Sincronizar el State
                const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id )
                setProyectos(proyectosActualizados)
                //Estableciendo alerta 
                setAlerta({
                    msg: data.msg,
                    error: false
                    }) 
                //Redirigiendo a la pagina de proyectos
                    setTimeout(()=>{
                        setAlerta({})
                        navigate('/proyectos')
                    },3000)
        }catch(error){
            console.log(error)
        }
    }
   
    const handleModalTarea = () => {

        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea =>{
        if(tarea?.id){
           await editarTarea(tarea)
        }else{
           await crearTarea(tarea)
        }

       
    }

    const crearTarea = async tarea =>{
         //Enviando la informacion hacia la API
         try{
            const token = localStorage.getItem('token')
            if(!token) return
   
            //configuracion del token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const {data} = await clienteAxios.post('/tareas',tarea, config)
            //Agrega la tarea al state
            //Copia del proyecto
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = [...proyecto.tareas, data]
            setProyecto(proyectoActualizado )
            //Reiniciando la alerta
            setAlerta({})
            //Reiniciando el modal del formulario
            setModalFormularioTarea(false)
        }catch(error){
            console.log(error)
        }
    }

    const editarTarea = async tarea => {
        try{
            const token = localStorage.getItem('token')
            if(!token) return
   
            //configuracion del token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }


            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
        
            //DOOM
        //Proyecto Actualizado
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => 
            tareaState._id === data._id ? data : tareaState)
        setProyecto(proyectoActualizado)
        setAlerta({})
        setModalFormularioTarea(false)
        }catch(error){
            console.log(error)
        }
        
    }

    const handleModalEditarTarea = tarea =>{
        setTarea(tarea)
        setModalFormularioTarea(true)
    
    }
    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }
    const eliminarTarea = async () =>{
        try{
            const token = localStorage.getItem('token')
            if(!token) return
   
            //configuracion del token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            //Enviandola a la API
            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
        setAlerta({
            msg: data.msg,
            error: false
        })
            //DOOM
        //Proyecto Actualizado
        const proyectoActualizado = {...proyecto}

        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState =>
            tareaState._id !== tarea._id)

        setProyecto(proyectoActualizado)
        setModalEliminarTarea(false)
        setTarea({})
        setTimeout(()=>{
            setAlerta({})
        },3000)

        }catch(error){
            console.log(error)
        }
    }

    const submitColaborador = async email =>{
     console.log(email)
} 
    return(
        <ProyectosContext.Provider
        value={{
            //Heredando los metodos a los otros componentes
            proyectos,
            mostrarAlerta,
            alerta,
            submitProyecto,
            obtenerProyecto,
            proyecto,
            cargando,
            eliminarProyecto,
            modalFormularioTarea,
            handleModalTarea,
            submitTarea,
            handleModalEditarTarea,
            tarea,
            modalEliminarTarea,
            handleModalEliminarTarea,
            eliminarTarea,
            submitColaborador
            
         }}
        >{children}
        </ProyectosContext.Provider>
    )

}
export {
    ProyectosProvider
}
export default ProyectosContext