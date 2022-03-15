import { useState, useEffect } from "react"
import { Link ,useParams } from "react-router-dom"
import Alerta from '../components/Alerta'
import clienteAxios from "../config/clienteAxios"
const NuevoPassword = () => {

  const [tokenValido, setTokenValido] = useState(false)
  const [alerta ,setAlerta] = useState({})

  const [passwordModificado, setPasswordModificado] = useState(false)

  //Leyendo el password
  const [password, setPassword] = useState('')
 //Leyendo el token con params
  const params = useParams()
  //Extrayendo token
  const {token} = params 

  
  useEffect(()=>{
    const comprobarToken = async () =>{
        try{
            //TODO: Mover hacia un cliente axios
            await clienteAxios.get(`/usuarios/olvide-password/${token}`)
            setTokenValido(true)
        }catch(error){
            setAlerta({
                msg: error.response.data.msg,
                error:true
            })
        }
    }
    comprobarToken()
  },[])

  //Async porque vamos a guardar el nuevo password en la base de datos
  const handleSubmit = async e =>{
      e.preventDefault();
//Verificacion de password de almenos de seis caracteres
      if(password.length < 6){
         setAlerta({
             msg: 'El Password debe ser almenos de seis caracteres',
             error: true
         })
         return 
  }
  //Almacenando el nuevo password
        try{
            const url = `/usuarios/olvide-password/${token}`
            const {data} = await clienteAxios.post(url,{password})
            setAlerta({
                msg: data.msg,
                error: false
            })
            setPasswordModificado(true)
        }catch(error){
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
}



  const {msg} = alerta
    return (
    <>
     <h1 className="text-slate-900 font-black text-6xl capitalize"> Restablece tu password y no pierdas tu acceso en {' '}
    <span className="text-slate-700">MyKiu</span>
    </h1>
        {msg && <Alerta alerta={alerta}/>}
     {tokenValido &&(
          <form className="my-10 bg-violet-300 shadow rounded-lg p-10"
            onSubmit={handleSubmit}
          >
  
          <div className="my-5">
              <label 
                  className="uppercase text-gray-900 block text-xl font-bold"
                  htmlFor = "password" 
                  >Nuevo Password</label>
              <input
              id="password" 
              type="password"
              placeholder="Escribe tu nuevo Password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50" 
              value={password}
              onChange= {e => setPassword(e.target.value)}
              />
          </div>

          <input
              type="submit"
              value="Guardar nuevo Password"
              className="bg-purple-400 mb-5 w-full py-3 text-white uppercase font-bold rounded
              hover:curso-pointer hover:bg-purple-500 transition-colors" 
          />

      </form>

     )}
      {passwordModificado &&(
            <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            //Redirigiendo a la pagina de registrar
            to="/"
          >Inicia Sesion</Link>
        )}


  </>
  )
}

export default NuevoPassword