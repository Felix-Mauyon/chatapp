import { useState, useEffect } from 'react'
import { account, ID } from '../api/appwrite'
import { useNavigate } from 'react-router-dom'
import { AuthForm } from './AuthForm'
import { addUser } from '../api/utils/dbActions'



export function Auth() {


    const [selected, setSelected] = useState('signup')
    const navigate = useNavigate()

    const checkSession = async () => {
        try {
            const response = await account.get()
            console.log('Session active: ', response)
            navigate('/create-group');

        } catch (error) {
            console.log('No active session: ', error.message)
            navigate('/')

       }
    }



useEffect(() => {
  checkSession();
   }, []);

    const handleSignUp = async (email, password, name) => {
        try {
            const response = await account.create(ID.unique(), email, password, name)
            console.log('User created successfully: ', response)
            await handleSignIn(email, password)
            await addUser(name)
        } catch (error) {
            console.log('Registration failed: ', error)
        }

    }


    const handleSignIn = async (email, password) => {
        try {
            const response = await account.createEmailPasswordSession(email, password);
            console.log('User logged in:', response)
            navigate('/create-group')
        } catch (error) {
            console.error('Login failed:', error);
        }
    }



    const handleSelected =(buttonState)=>(setSelected(buttonState))

    return (
        <section className='w- full h-[100vh] text-[1.5em] text-m_text p-6 font-rubik bg-[#eaeaea]'>
            <div>
                <div>
                    <h2 onClick={()=>handleSelected('signup')}>Sign Up</h2>
                    <h2 onClick={()=>handleSelected('login')}>Login</h2>
                </div>
                <AuthForm signup={ handleSignUp } signin={ handleSignIn } selected={selected} />
            </div>

        </section>
    )

}

