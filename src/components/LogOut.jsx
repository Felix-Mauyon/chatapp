import { useNavigate } from "react-router-dom"
import { account } from "../api/appwrite"

export default function LogOut (){
    const navigate = useNavigate()
    const logOut = async () => {
        try {
        const response = await account.deleteSession('current')
        console.log('User logged out', response)
        navigate('/')
    } catch (error) {
        console.log('Error: ', error)

    }
    }

    return (
        <div className='flex flex-row justify-end bg-[#eaeaea] relative'>
         <button onClick={()=>logOut()} className="w-[100px] h-[50px] rounded-lg p-1 text-white bg-m_blue hover:bg-[#C5C6EF] mt-[1%] mr-[2%] fixed">Log out</button>
        </div>
            )
}
