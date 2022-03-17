import jwt from "jsonwebtoken"

const generarJWT = (id) =>{
    //genera un metodo jsonwebtoken toma la palabra secreta
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '31d',
    });

    
    
}
export default generarJWT