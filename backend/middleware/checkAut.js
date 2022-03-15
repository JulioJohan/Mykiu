import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js';

//next  funciona para que vayamos al siguiente middleware
const checkAuth = async (req, res, next) => {
    let token;
    //enviamos el token del la utorizacion de postman
    //Estamos henviando un token en esos headers
    if(req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
    ){
        try{
            //
            token = req.headers.authorization.split(' ')[1];
            //Leer el token y verificarlo
            //Lo mimas variable que haces para firmarlo es ugual para verificarlo
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //Va a buscar el usario por ese id
            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")
            return next()
        }catch(error){
            return res.status(404).json({msg : 'Hubo un error'})
        }
       
    } 
    if(!token){
        const error = new Error('Token no valido')
        return res.status(401).json({msg: error.message})
    }
    next()
};
export default checkAuth;

