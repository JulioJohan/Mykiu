
import {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'
const ConfirmarCuenta = () => {
  //obteniendo el id de la url
  const params = useParams()

  const [alerta,setAlerta ] = useState({})
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)
  //Obtenido la id de params  
  const {id} = params
  //requirimeos
  
  useEffect(()=>{
    const confirmarCuenta = async()=>{
      try{
        //Obteniendo la URL 
        const url = `/usuarios/confirmar/${id}`
        const {data } = await clienteAxios.get(url)
          //Enviando menasjae
        setAlerta({
          msg: data.msg,
          error: false
        })
        setCuentaConfirmada(true)
         

        console.log(data)
      }catch(error){
        //Enviando menasjae
        setAlerta({
          msg: error.response.data.msg,
          error:true
        })
        
      }
    }
    confirmarCuenta()
  },[])

  const {msg} = alerta
  return (
    <>
      <h1 className="text-slate-900 font-black text-6xl capitalize"> Confirma tu Cuenta y Comienza en {' '}
      <span className="text-slate-700">MyKiu</span>
      </h1>

      <div className='mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white'>
        {msg && <Alerta alerta={alerta}/>}

        {cuentaConfirmada &&(
          <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          //Redirigiendo a la pagina de registrar
          to="/"
          >Inicia Sesion</Link>
        )}
      </div>
    </>
  )
}

export default ConfirmarCuenta