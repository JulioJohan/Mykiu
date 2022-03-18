import { useState, useEffect, createContext } from "react";
//Para redirigir hacia otra url
import { useNavigate } from "react-router-dom";
//importacion para redireccionar
import clienteAxios from "../config/clienteAxios";
//Importando sockets
import io from 'socket.io-client'
import useAuth from '../hooks/useAuth'
//Creando variable global a la conexion
let socket;

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
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)

    //Buscador de proyectos
    const [buscador, setBuscador] =  useState(false)
    const navigate = useNavigate()

    const {auth} = useAuth()

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
        }
    }
        obtenerProyectos()
    },[])

    useEffect(()=>{
        socket = io(import.meta.env.VITE_BACKEND_URL )
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
         setAlerta({})
    }catch (error){
        //Redirigiendo al usuario si no tiene permisos al entrar
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            //Reiniciando alerta
            setTimeout(()=>{
                setAlerta({})
            },3000)
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
          
            // const proyectoActualizado = {...proyecto}
            // proyectoActualizado.tareas = [...proyecto.tareas, data]
            // setProyecto(proyectoActualizado)
            //Reiniciando la alerta
            setAlerta({})
            //Reiniciando el modal del formulario
            setModalFormularioTarea(false)
            //socket io
            //Crenando un evento
            socket.emit('nueva tarea', data)
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
        // const proyectoActualizado = {...proyecto}
        // proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState =>
        // tareaState._id === data._id ? data : tareaState)
        // setProyecto(proyectoActualizado) 
        setAlerta({})
        setModalFormularioTarea(false)

        //Socket
        socket.emit('actualizar tarea', data)
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
        // const proyectoActualizado = {...proyecto}
        // proyectoActualizado.tarea = proyectoActualizado.tareas.filter(tareaState=>
        // tareaState._id !== tarea._id)
        // setProyecto(proyectoActualizado)
        setAlerta({
            msg: data.msg,
            error: false
        })
       
        setModalEliminarTarea(false)
        
        //Soket io
        socket.emit('eliminar tarea', tarea)

        setTarea({})
        setTimeout(() => {
            setAlerta({})
        }, 3000);

        }catch(error){
            console.log(error)
        }
    }

    const submitColaborador = async email =>{
       
       setCargando(true)
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
            const {data} = await clienteAxios.post('/proyectos/colaboradores' , {email}, config)
           setColaborador(data)
           setAlerta({})
       }catch(error){
           setAlerta({
               msg: error.response.data.msg,
               error:true
           })
       }finally{
           setCargando(false)
       }     
    }

    const agregarColaborador = async email =>{
        
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
            const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}` , email, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            //Limpiando Alertas
            setColaborador({})
            setTimeout(() =>{
                setAlerta({})
            },3000)
        }catch(error){
            setAlerta({
                msg: error.response.data.msg,
                error: true    
            })
        }
    }
    const handleModalEliminarColaborador =(colaborador) =>{
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }
    const eliminarColaborador = async() =>{
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
            const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}` , {id: colaborador._id}, config)
            
            const proyectoActualizado = {...proyecto}
            
            proyectoActualizado.colaboradores =  proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !==  colaborador._id  )
            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)
            setTimeout(() =>{
                setAlerta({})
            },3000)
        }catch(error){
            console.log(error.response)
        }
    }
    const completarTarea = async id => {
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
        const {data} = await clienteAxios.post(`/tareas/estado/${id}`,{}, config)

        // const proyectoActualizado = {...proyecto}
        // proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState=>
        // tareaState._id === data._id ? data : tareaState)
        // setProyecto(proyectoActualizado)

        setTarea({})
        setAlerta({})

        ///Socket .io 
        socket.emit('cambiar estado', data )

    }catch(error){
           console.log(error.response)
       }
    }
    const handleBuscador = () =>{
        setBuscador(!buscador)
    }

    //Socket io
    const submitTareasProyecto = (tarea) =>{
          //Agrega la tarea al state
            //Copia del proyecto
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
            setProyecto(proyectoActualizado )
    }
    const eliminarTareaProyecto = tarea =>{
             //DOOM
        //Proyecto Actualizado
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState =>
        tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = tarea =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => 
        tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }
    const cambiarEstadoTarea = tarea =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => 
        tareaState._id === tarea._id ? tarea: tareaState)
        setProyecto(proyectoActualizado)
    }
    const cerrarSesionProyectos = ()=>{
        setProyectos([])
        setProyecto({})
        setAlerta({})
        
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
            colaborador,
            submitColaborador,
            agregarColaborador,
            handleModalEliminarColaborador,
            modalEliminarColaborador,
            eliminarColaborador,
            completarTarea,
            buscador,
            handleBuscador,
            submitTareasProyecto,
            eliminarTareaProyecto,
            actualizarTareaProyecto,
            cambiarEstadoTarea,
            cerrarSesionProyectos
            
         }}
        >{children}
        </ProyectosContext.Provider>
    )

}
export {
    ProyectosProvider
}
export default ProyectosContext