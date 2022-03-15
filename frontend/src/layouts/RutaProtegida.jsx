import { Outlet,Navigate } from "react-router-dom"
//importar nuestro hook para extraer la informacion
import useAuth from "../hooks/useAuth"
//importando los componentes
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"


const RutaProtegida = () => {


    const {auth, cargando} = useAuth()

    if(cargando) return 'Cargando...'
    //Auth ._id es que esta autenticado si no rediregen a la pagina principal
  return (
    <>  
        
        {auth._id ?(
          <div className="bg-gray-100">
              <Header/>

              <div className="md:flex md:min-h-screen">
                <Sidebar/>
                <main className="p-10 flex-1 bg-slate-300">
                  <Outlet/>
                </main>
              </div>
          </div>
        ) : <Navigate to = "/"/>  }
    </>
  )
}

export default RutaProtegida