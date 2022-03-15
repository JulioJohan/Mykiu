//Importando rutas React - dom
import {BrowserRouter, Routes, Route} from 'react-router-dom'
//Importando el layout
import RutaProtegida from './layouts/RutaProtegida'
//Importacion de componentes
import AuthLayout from './layouts/AuthLayout'
import  Login  from './paginas/Login'
import Registrar from './paginas/Registrar'
import OlvidePassword from './paginas/OlvidePassword'
import NuevoPassword from './paginas/NuevoPassword'
import ConfirmarCuenta from './paginas/ConfirmarCuenta'
import Proyectos from './paginas/Proyectos'
import NuevoProyecto from './paginas/NuevoProyecto'
import Proyecto from './paginas/Proyecto'
import EditarProyecto from './paginas/EditarProyecto'
import NuevoColaborador from './paginas/NuevoColaborador'

import {AuthProvider} from './context/AuthProvider'
import { ProyectosProvider } from './context/ProyectosProvider'


function App() {

  return (
    //Asignando Rutas De nuestra APP
    <BrowserRouter> 
     <AuthProvider> 
     <ProyectosProvider>
        <Routes>
          /*Creando ruta Publica para la creacion de cuenta
          todos tendra la autentificacion de AuthLayout*/
            <Route path='/' element={<AuthLayout/>}>
              /**Creando Ruta privada cuando el usuario ya este iniciado sesion */ 
                <Route index element = {<Login/>}/>
                <Route path= 'registrar'element ={<Registrar/>}/>
                <Route path= 'olvide-password'element ={<OlvidePassword/>}/>
                <Route path= 'olvide-password/:token'element ={<NuevoPassword/>}/>
                <Route path= 'confirmar/:id'element ={<ConfirmarCuenta/>}/>
            </Route>
            //No va a consultar los proyectos si no esta autenticado los usuarios
            <Route path='/proyectos' element={<RutaProtegida/>}>
              <Route index element = {<Proyectos/>}/>
              < Route path='crear-proyecto' element = {<NuevoProyecto />}/>
              < Route path='nuevo-colaborador/:id' element = {<NuevoColaborador/>}/>
              < Route path=':id' element = {<Proyecto />}/>
              < Route path='editar/:id' element = {<EditarProyecto />}/>
            </Route>
          </Routes>
          </ProyectosProvider>
      </AuthProvider> 
    </BrowserRouter>
  )
}

export default App
