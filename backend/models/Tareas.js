import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
    nombre:{
        type: String,
        trim: true,
        required: true
    },
    descripcion:{
        type: String,
        trim: true,
        required: true,
    },
    estado:{
        type: Boolean,
        default: false
    },
    fechaEntrega:{
        type: Date,
        required: true,
        default: Date.now()
    },
    prioridad:{
        type: String,
        required: true,
        //Solo aceptara ese tipos de propiedades
        enum:['Baja','Media', 'Alta']
    },
    //Proyecto Asociado
    //accede a un para que nos traiga el proyecto
    proyecto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto',

    },
},{
    timestamps: true

});

const Tarea = mongoose.model('Tarea',tareaSchema);
export default Tarea;