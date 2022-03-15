import mongoose  from "mongoose";

const proyectosSchema = mongoose.Schema({
    nombre:{
        type:String,
        trim: true,
        required:true
    },
    descripcion: {
        type: String,
        trim: true,
        required: true
    },
    fechaEntrega:{
        type: Date,
        //Obteniendo los datos
        default: Date.now()
    },
    cliente: {
        type: String,
        trim: true,
        required: true
    },
    //El creador del proyecto es la unica que puede crear las tareas
    creador:{
        //Relacionando la Usuario en Proyecto
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    tareas:[
       {
           type:mongoose.Schema.Types.ObjectId,
           ref:'Tarea'
       } 
    ],
    //Corchetes porque puede agregar varios colaboradores
    colaboradores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        },
    ],

},{
    //Crea los createAt y UpdateAt
    timestamps: true,
})

const Proyecto = mongoose.model('Proyecto', proyectosSchema);
export default Proyecto;