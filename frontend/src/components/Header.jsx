import {Link} from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useProyectos from '../hooks/useProyectos'

import Busqueda from './Busqueda'

const Header = () => {

  const {handleBuscador, cerrarSesionProyectos} = useProyectos()
  const {cerrarSesionAuth} = useAuth()
 
  const handleCerrarSesion =() =>{
    cerrarSesionAuth()
    cerrarSesionProyectos()
    localStorage.removeItem('token')
  }
 
  return (
    <header className="px-4 py-5 bg-violet-900 border-b">
        <div className="md:flex md:justify-between ">
            <h2 className="text-4xl text-white font-black text-left mb-5 md:mb-0">
                Mykiu
            </h2>

            
            <div className='flex md:flez-row items-center gap-4'>
                <button
                type='button'
                className='font-bold uppercase text-white'
                onClick={handleBuscador}
                >Buscar Proyecto
                </button>
                <Link
                 to = "/proyectos"
                 className='font-bold uppercase text-white'>Proyectos</Link>

                 <button type='button'
                    className='text-gray-500 text-sm bg-white p-3 rounded-md uppercase font-bold'
                    onClick={handleCerrarSesion}
                 >   Cerrar Sesion</button>
                 <Busqueda/>
            </div> 
        </div>
    </header>
  )
}

export default Header