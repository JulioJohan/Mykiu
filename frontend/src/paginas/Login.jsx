import { useState } from "react"
//Importacion para apuntar hacia a otras paginas
import { Link, useNavigate } from "react-router-dom"
import Alerta from "../components/Alerta"
//Para validar
import clienteAxios from "../config/clienteAxios"
//Importando nuestro hook
import useAuth from "../hooks/useAuth"



export const Login = () => {
    const [email, setEmail ] = useState('')
    const [password, setPassword] = useState('')
    const [alerta, setAlerta] = useState({})
  


    //Llamando la funcion 
    const { setAuth} = useAuth();


    //Establecioendo navigate para que el usuario ingresea a su sesion
    const navigate = useNavigate()
  
    const handleSubmit = async e => {
        e.preventDefault();

        if([email,password].includes('')){
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        //Consultando en la api para autenticar al usuario
        try{
            const {data} = await clienteAxios.post('/usuarios/login',{email, password})

            setAlerta({})
            //Guardando en el local Storage
            localStorage.setItem('token', data.token)
            setAuth(data)
            //Redirigiendo al usuario cuando se autentifique
            navigate('/proyectos')
        }catch(error){
            setAlerta({
            msg:  error.response.data.msg,
            error:true
            })
        }

    }
    const {msg} = alerta
    return (
    <>
        <h1 className="text-slate-900 font-black text-6xl capitalize"> MyKiu{' '}
        <span className="text-slate-700">Administra tus Proyectos</span>
        </h1>
    
    {msg && <Alerta alerta={alerta}/>}
    <form className="my-10 bg-violet-300 shadow rounded-lg p-10"
        onSubmit={handleSubmit}
    >
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
            onChange = {e => setEmail(e.target.value)}
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
            value={password}
            onChange={e => setPassword(e.target.value)}
            />
        </div>

        <input
            type="submit"
            value="Iniciar sesión"
            className="bg-purple-900 mb-5 w-full py-3 text-white uppercase font-bold rounded
            hover:curso-pointer hover:bg-purple-500 transition-colors" 
        />

    </form>

    <nav className="lg:flex lg:justify-between">
        <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            //Redirigiendo a la pagina de registrar
            to="/registrar"
        >¿No tienes Cuenta? Regístrate</Link>
        <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            //Redirigiendo a la pagina de registrar
            to="/olvide-password"
        >¿Se te olvidó la contraseña? :0</Link>

    </nav>
    </>
  )
}

export default Login
