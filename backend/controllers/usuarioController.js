//Importando el esquema de Usuario
import Usuario from "../models/Usuario.js";

//Importando el generador de ID
import generarId from "../helpers/generarId..js";
//importando el jsonwebtonken 
import generarJWT from "../helpers/generarJWT.js";
//Importando funcion para confirmacion de registro
import {emailRegistro, emailOlvidePassword} from '../helpers/email.js';
//Evitar registros dupliacados con un mensaje para el usuario
//Extrayendo el email del squema


//Creando un funcion
//req es lo que esta enviando al servidor
//res es la respuesta del servidor
//Importamos el modelo de la base de datos
//Crearemos un nuevo usuario y almacenaro en la DB

const registrar = async (req, res) => {
   
    //Buscando el atributo emaul
    const { email  } = req.body;
    //Buscando si un usuario es existe con el email
    //Comprabar si el usurio existe
    const existeUsuario = await Usuario.findOne({email});
    
    //Mandando el usuario que ya esta registrado
    if(existeUsuario){
        const error = new Error('Usuario ya registrado')    
        return res.status(400).json({msg: error.message})
    }

    try{
        //Se almacena en el usuario
        const usuario = new Usuario(req.body)
        //Al generar el token llama la funcion de generarID
        usuario.token = generarId();
        //Almacenando en la base de datos
       await usuario.save()
        //Envial el email de confirmacion
        emailRegistro({
            //Le enviaremos el email
            email: usuario.email,
            //Enviando el nombre 
            nombre: usuario.nombre,
            //Enviando el token
            token: usuario.token

        })

        res.json({msg: 'Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta'});
    }catch(error){
        console.log(error)
    }
   
};

const autenticar = async(req, res) =>{

    const {email, password } = req.body; 
    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email})
    //Si el usuario no esta registrado
     if(!usuario){
        //Mandando mensaje a postmain
         const error = new Error("El usuario no existe")
         return res.status(404).json({msg: error.message});
     }
    //Comprobara si el usario esta confirmado
    if(!usuario.confirmado){
        //Mandando mensaje a postmain
         const error = new Error("Tu cuenta no esta confirmada")
         return res.status(403).json({msg: error.message});
     }

    //Comprobar su password
    if (await usuario.comprobarPassword(password)){
        res.json({_id: usuario._id,
            nombre:usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error("El password es incorrecto")
         return res.status(403).json({msg: error.message});
    }

};
//Routing dinamico puede soportar multiples valores en su ruta
//Confirmando cuentas
const confirmar = async (req, res) =>{
    const {token} = req.params
    //buscando un usuario con ese token
    const usuarioConfirmario = await Usuario.findOne({token})
    if(!usuarioConfirmario){
        const error = new Error("token no valido")
        return res.status(403).json({msg: error.message}); 
    }
    try{
        //Si el usuario tiene el token correctamente se vuelve a true
        usuarioConfirmario.confirmado = true;
        //Modificando el token porque solo se genera una vez para confirmar la cuenta
        usuarioConfirmario.token = "";
        //Almacenando en la base de datos
        await usuarioConfirmario.save();
        res.json({msg: 'Usuario Confirmado Correctamente'})
    }catch(error){
        console.log(error)
    }
}
const olvidePassword = async (req,res)=>{
    const {email} = req.body;
    const usuario = await Usuario.findOne({email})
    //Si el usuario no esta registrado
     if(!usuario){
        //Mandando mensaje a postmain
         const error = new Error("El usuario no existe")
         return res.status(404).json({msg: error.message});
     }
     try{
         //Generando token
        usuario.token = generarId()
        //guardando en la base de datos
        await usuario.save()

        //Enviar el Email
        emailOlvidePassword({
              //Le enviaremos el email
             email: usuario.email,
             //Enviando el nombre 
             nombre: usuario.nombre,
             //Enviando el token
            token: usuario.token
            
        })
        //enviando el mensaje al usuario
        res.json({msg: 'Hemos enviado un email con las instrucciones'})
     }catch(error){

     }
}

const comprobarToken = async(req, res) =>{
    //parms obtentiendo la unformacion de la url y con body es de un formulario
    const {token} = req.params;
    //buscando si el token es valido de la base de datos
    const tokenValido = await Usuario.findOne({token});
    if(tokenValido){
       res.json({msg: 'Token valido y el usuario existe'})
    }else{
          //Mandando mensaje a postmain
          const error = new Error("Token no valido")
          return res.status(404).json({msg: error.message});
    }

}; 
const nuevoPassword = async (req, res) =>{
     const {token} = req.params;
     //Leyendo el passwor que nos esta poniendo el usuario
     const {password} = req.body
     const usuario = await Usuario.findOne({token});
     if(usuario){
         //asignando el nuevo password y 
        usuario.password = password;
        //poniendo otro token para que no el mismo
        usuario.token = ''
       try{
        await usuario.save()
        res.json ({msg : 'Password modificado'})
       }catch(error){
           console.log(error)
       }
    }else{
           //Mandando mensaje a postman
           const error = new Error("Token no valido")
           return res.status(404).json({msg: error.message});
     }
}
const perfil = async (req,res) => {
    const {usuario} = req;
    res.json(usuario)
}
export {registrar,
     autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,nuevoPassword,
    perfil }