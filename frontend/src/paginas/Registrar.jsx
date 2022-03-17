import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
//Para comunicarnos con el backend utilizaremos axios para tener comunicacion con el frontend
import clienteAxios from '../config/clienteAxios'

export const Registrar = () => {
//Establecienfo el State del Formulario para saber que el usuario este escribiendo en estos campos
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repetirPassword, setRepetirPassword] = useState('')
    //Objeto porque tenemos un error y un mensaje en la alerta
    const [alerta, setAlerta] = useState({})
    const handleSubmit = async e =>{
        //Antes de comprobaremos si esta los campos llenos
        e.preventDefault();
        //Comprobacion de que los campos este llenos
        if([nombre, email,password,repetirPassword].includes('')){
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                //Estableciendo error tu para que se cumpla la condicion de Alert.jsx
                error: true
            })
            //Para que no se siga ejecutando el codigo
            return
        }
        //Compracion si los passwords son iguales o no iguales
        if(password !== repetirPassword){
            setAlerta({
                msg: 'Los password no son iguales',
                //Estableciendo error tu para que se cumpla la condicion de Alert.jsx
                error: true
            })
            return
        }  
        //Verificacion del password sea mayor a 6 caracteres
        if(password.length < 6 ){
            setAlerta({
                msg: 'El password es muy corto, agrega minimo 6 caracteres',
                error: true
            })
            return
        } 
        //Si todo esta bien  
        setAlerta ({})
        //Crear el usuario en la ApI
        try{

            
            //Enviando la peticion a la url y enviando informacion
            const {data} = await clienteAxios.post(`/usuarios`,
            {nombre, email, password})

            //Obtenindo el data del servidor y mostramos el mensaje
            setAlerta({
                //Me regre
                msg: data.msg,
                error:false
            })

            //;Limpiando los cmapos si el usuario ser registro correctamente
            setNombre('')
            setEmail('')
            setPassword('')
            setRepetirPassword('')
        }catch(error){
            setAlerta({
                //Me regresa la alerta del error que se escribio en el backen
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const {msg} = alerta
  return (
    <>
        <h1 className="text-slate-900 font-black text-6xl capitalize"> Crea tu Cuenta en{' '}
        <span className="text-slate-700">MyKiu</span>
        </h1>
    
    {msg && <Alerta alerta={alerta}/>}
    <form 
        className="my-10 bg-violet-300 shadow rounded-lg p-10"
        onSubmit={handleSubmit}>
        <div className="my-5">
            <label 
                 className="uppercase text-gray-900 block text-xl font-bold"
                 htmlFor = "nombre" 
                 >Nombre</label>
            <input
            id="nombre" 
            type="text"
            placeholder="Tu nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50" 
            value={nombre}
            //lo que el usuario vaya escribiendo se va a establecer en el nombre    
            onChange = {e => setNombre(e.target.value)}
            />
           
        </div>
        <div className="my-5">
            <label 
                 className="uppercase text-gray-900 block text-xl font-bold"
                 htmlFor = "email" 
                 >Email</label>
            <input
            id="email" 
            type="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50" 
            value={email}
            onChange = { e => setEmail(e.target.value)}
            />
            
        </div>
        <div className="my-5">
            <label 
                 className="uppercase text-gray-900 block text-xl font-bold"
                 htmlFor = "password" 
                 >Password</label>
            <input
            id="password" 
            type="password"
            placeholder="Password de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value ={password}
            onChange = {e => setPassword(e.target.value)}
            />
            
        </div>
        <div className="my-5">
            <label 
                 className="uppercase text-gray-900 block text-xl font-bold"
                 htmlFor = "password2" 
                 >Repetir Password</label>
            <input
            id="password2" 
            type="password"
            placeholder="Repetir tu password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50" 
            value={repetirPassword}
            onChange = {e => setRepetirPassword(e.target.value)}
            />
        </div>

        <input
            type="submit"
            value="Crear Cuenta"
            className="bg-violet-900 mb-5 w-full py-3 text-white uppercase font-bold rounded
            hover:curso-pointer hover:bg-purple-500 transition-colors" 
        />

    </form>

    <nav className="lg:flex lg:justify-between">
        <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            //Redirigiendo a la pagina de registrar
            to="/"
        >Ya tienes cuenta en MyKiu? Inicia sesión</Link>
        <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            //Redirigiendo a la pagina de registrar
            to="/olvide-password"
        >Se te olvido la contraseña? :0</Link>

    </nav>
    </>
  )

}

export default Registrar