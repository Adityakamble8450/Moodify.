import {register , login , getme , logout} from "./services/auth.api"
import { useContext } from "react"
import { AuthContext } from "./auth.context"


const UseAuth = () =>{ 
    const context = useContext(AuthContext)
    const {user , setUser , loading , setLoading} = context

    const handleRegister = async ({username , email , password}) =>{
        setLoading(true)
        const data = await register({username , email , password})
        setUser(data.user)
        setLoading(false)
    }

    const handleLogin = async ({email , password}) =>{
        setLoading(true)
        const data = await login({email , password})
        setUser(data.user)
        setLoading(false)
    }

    const handleGetMe = async () =>{
        setLoading(true)
        const data = await getme()
        setUser(data.user)
        setLoading(false)
    }

    const handleLogout = async () =>{
        setLoading(true)
        await logout()
        setUser(null)
        setLoading(false)
    }



    return { user,loading , handleRegister, handleLogin, handleGetMe, handleLogout }


}

export default UseAuth