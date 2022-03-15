import  express  from "express";
//Definir get o delete Etc
const router = express.Router();
//Metodo post, cuando tienes un formulario
//Poniendo las rutas
//2 enpoints
//Importando la funcion de usuarios
import {registrar,
    autenticar,
     confirmar,
     olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil} from '../controllers/usuarioController.js';

//Importanco el check aut
 import checkAuth from '../middleware/checkAut.js'   

//Cuando el usuario visite este get
//Separando funciones en los controladores
//llamando la funcion de usuarios que esta importad de usuario Controllers.js
//Autenticacion, Registro y confirmacion de usuarios
router.post('/',registrar);//Crea un nuevo usuario
router.post('/login',autenticar);//Autenticar (login)
//Routing dinamico con express
router.get('/confirmar/:token', confirmar)//confirmar cuenta
router.post('/olvide-password',olvidePassword)//ruta para enviar nuevo token al usuario
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)//comprobar el toket y asignando nueva contrasena

//entrara primero a perfil despues ejecutara la  funcion check y despues perfil
//El checck out verificara que el token sea cierto 
router.get('/perfil',checkAuth, perfil)
export default router;
