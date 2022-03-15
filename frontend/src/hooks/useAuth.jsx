//useContext es para accerder a la informacion de un context
import {useContext} from 'react'
import AuthContext from '../context/AuthProvider'

//Creacion de nuestro hook
const useAuth =() => {  
    return useContext(AuthContext)
}

export default useAuth