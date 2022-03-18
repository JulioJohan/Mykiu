//Buscando la libreria express y guardandolo en la variable express
import express  from 'express';
//Archivos poner .js en los modulos no se ponen
//Importando el archivo db que tiene la configuracion de mongo
import conectarDB from './config/db.js'
//Importando el dotenv
import dotenv from "dotenv";
//Importando cors para la comunicacion del frontend
import cors from 'cors'
//Importando las routes de usuarios
import usuarioRoutes from'./routes/usuarioRoutes.js'
//importando las rutas de proyectos
import proyectoRoutes from './routes/proyectoRoutes.js'
//importando las rutas de tareas 
import tareaRoutes from './routes/tareaRoutes.js'
//Guardando la funcion express en la variable app
const app =  express();
//para poder leer informacion de tipo json

app.use(express.json())
//buscara un archivo en el backen
dotenv.config();

//lmando la funcion
conectarDB();

//Configurando cors
//Proteccion de ruta en el ENV
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    //origen del request
    //Callback que nos permitira el acceso
    origin: function(origin,callback ){
        //Si esta en la lista blanca puede consultar a la api
        if(whitelist.includes(origin)){
            //Puede consultar la APi
            callback(null,true)
        }else{
            //No esta permitido el request
            callback(new Error('Error de Cors'))
        }
    }
}
app.use(cors(corsOptions));
//req son los datos que tu envias
//res es la respuesta que estas obteniendo por esa peticion

//Routing
//el use soportara todo como el get, delete
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)


//Esta variable es para cuando ya este en produccion
const PORT = process.env.PORT || 4000;



//Asignando el puerto de nuestro servidor
const servidor = app.listen(4000, () =>{
    console.log(`Servidor Corriendo en el puerto ${PORT}`)
});
import {Server, Socket} from 'socket.io'
//Pasando serividor que es donde se conencta el servidor 
const io = new Server(servidor,{
    pingTimeout: 60000,
    //Donde esta la ubicacion de nuestro frontEnd
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});
//Conexion con socket io
io.on('connection', (socket) =>{
    //console.log('Conectado a socket.io')
    //Definir los eventos de socket io
    socket.on('abrir proyecto', (proyecto)=>{
        //Enviando a una sala a diferente usuario
        //En que pagina esta cada usuario
        socket.join(proyecto)    
    });
    //Escuchando un evento
    socket.on('nueva tarea', (tarea) =>{
        const proyecto = tarea.proyecto
        //Emitiendo hacia el frontend
        socket.to(proyecto).emit('tarea agregada', tarea)
    });

    socket.on('eliminar tarea',(tarea) =>{
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    });
    socket.on('actualizar tarea' ,(tarea)=> {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea actualizada', tarea)
    });

    socket.on('cambiar estado', (tarea)=>{
        //Leer el proyecto
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('nuevo estado', tarea)
    });
});