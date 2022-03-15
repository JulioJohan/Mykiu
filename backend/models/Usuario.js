import mongoose from "mongoose";
//importando dependencia para hashear las contrasenas
import bcrypt from 'bcrypt'
//Schema de la base de datos
const usuarioSchema = mongoose.Schema({
    nombre: {
        //Nombre es tipo String 
        type:String,
        //Es obligatorio
        required: true,
        //Elimina los primeros espacion 
        trim: true
    },
    password: {
        //Nombre es tipo String 
        type:String,
        //Es obligatorio
        required: true,
        //Elimina los primeros espacion 
        trim: true
    },
    email:{
         //Nombre es tipo String 
         type:String,
         //Es obligatorio
         required: true,
         //Elimina los primeros espacion 
         trim: true,
         //Que sea de tipo unico
         unique:true,

    },
    token:{
        type: String,
    },
    //El usuario le llegara un correo de confirmacion asi que por default estara en falase
    confirmado:{
        type: Boolean,
      //Estara de default
        default: false
    }
    },
    {
        timestamps: true,
    }
);
//Antes de guardar en una base de datos
usuarioSchema.pre("save", async function(next){
    //Va a revisar que no haya sido cambiado
    if(!this.isModified("password")){
        //si no esta modificando el password entonces next
       //Siguiente mildewer
        next();
    }
    //generando hash
    const salt = await bcrypt.genSalt(10);
    //llamando lo que queremos hasherar y llamando la variable de salt
    this.password = await bcrypt.hash(this.password ,salt)

});
//Comprobar El password
//Async porque vamos a consultar a la base de datos 
//Y comprobar si el datos es correcto
usuarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    //compare comprabara un String que si estaa haseado y otro que no  y comprabara si el password es correcto
    return await bcrypt.compare(passwordFormulario, this.password);
}

//
const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario