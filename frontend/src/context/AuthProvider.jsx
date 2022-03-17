
import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
//Obteniendo informacion del hook
const AuthContext = createContext();

//AuthProvider Rodeara toda la aplicacion
const AuthProvider = ({children}) => {
//Objeto para almacenar la utenticacion
const [auth, setAuth] = useState({})
const [cargando, setCargando]= useState(true)
//Redireccionar al usuario
const navigate = useNavigate()
//Compropar un token para validar un usuario
useEffect(()=>{
    const autenticarUsuario = async ()=> {
        const token = localStorage.getItem('token')
        if(!token){
            setCargando(false)
            return
        }
        //Enviando por configiracion
        const config = {
            headers:{
                //Valida lo que esta configurado en el backend
                'Content-Type': "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try{
            const {data} = await clienteAxios.get('/usuarios/perfil',config)
            setAuth(data)
            //navigate('/proyectos')
        }catch(error){ 
            setAuth({})
        }
        setCargando(false)
       

    }
    autenticarUsuario()
    
}, [])
    const cerrarSesionAuth = () =>{
        setAuth({})
    }

    //Informacion disponible que esten para los demas componentes
    return(
        <AuthContext.Provider
        value={{
            //Lo que esta dentro de value es lo que estara en disposicion a los demas componentes
            auth,
            setAuth,
            cargando,
            cerrarSesionAuth
        }}
        >
            {children}
        </AuthContext.Provider>
    )

}
export {
    AuthProvider
}

export default AuthContext;