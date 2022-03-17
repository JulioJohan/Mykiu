import {useState} from 'react'
import { Link } from "react-router-dom"
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'
const OlvidePassword = () => {
    const [email, setEmail] = useState('')
    const [alerta, setAlerta] = useState({})

    const handleSubmit = async e => {
        e.preventDefault()

        if(email === '' || email.lenght <6 ){
            setAlerta({
                msg: 'El email es obligatorio',
                error : true
            })
            return
        }
        
    try{
        //Para obtener una respuesta
        const {data} = await clienteAxios.post(`/usuarios/olvide-password`,
        {email})
        setAlerta({
            msg: data.msg,
            error: false
        })
    }catch(error){
        setAlerta({
            msg: error.response.data.msg,
            error: true
        })
    }
}   

    const {msg} =alerta

  return (
    <>
    <h1 className="text-slate-900 font-black text-6xl capitalize"> Recupera tu acceso en{' '}
    <span className="text-slate-700">MyKiu</span>
    </h1>
    {msg && <Alerta alerta={alerta}/>}
<form className="my-10 bg-violet-300 shadow rounded-lg p-10"
    onSubmit={handleSubmit}>
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
   
    <input
        type="submit"
        value="Enviar Instrucciones"
        className="bg-violet-900 mb-5 w-full py-3 text-white uppercase font-bold rounded
        hover:curso-pointer hover:bg-purple-500 transition-colors" 
    />

</form>

<nav className="lg:flex lg:justify-between">
    <Link
        className="block text-center my-5 text-slate-500 uppercase text-sm"
        //Redirigiendo a la pagina de registrar
        to="/"
    >Ya tienes cuenta en MyKiu? Inicia Sesion</Link>
    <Link
       className="block text-center my-5 text-slate-500 uppercase text-sm"
        //Redirigiendo a la pagina de registrar
        to="/registrar"
    >No tienes Cuenta en MyKiu? Registrate</Link>

</nav>
</>
  )
}

export default OlvidePassword