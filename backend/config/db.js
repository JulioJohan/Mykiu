import mongoose from 'mongoose';

//Funcion para conectar la base de datos
const conectarDB = async () =>{
    //Try cath por si tenemos un error
    try{
        //conectando con mongoose
        const connection = await mongoose.connect(
            process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
            });
         //Va a leer la conecction de const
         const url = `${connection.connection.host}:${connection.connection.port} `;
            //Imprimiendo en la consolo que esta conectada con MongoDb
         console.log(`MongoDB Conectado en: ${url }`)   
    }catch(error){
        //Mandar que tipo de error es
        console.log(`error: ${error.message}`)
        //Terminamos el proceso ya que mongo termina con 1
        //Forzar el proceso termine
        process.exit(1)
    }
   
}
export default conectarDB;