import { useState } from 'react'



function AuthForm({ selected, signup, signin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password:''
    })


    const handleChange = (id, change) => {
        setFormData((prevData) => {
            const updated = { ...prevData, [id]: change }
            return updated

        })
    }

    return (
        <>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" value={formData.email} id="email" onChange={(e)=>handleChange(e.target.id, e.target.value)}/>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={formData.password} id="password" onChange={(e) => handleChange(e.target.id, e.target.value)} />
            </div>

            {selected === 'signup' && (
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" value={formData.name} id="name" onChange={(e) => handleChange(e.target.id, e.target.value)} />
                </div>
            )}
            <button onClick={() => selected==='signup' ? signup(formData.email, formData.password, formData.name) : signin(formData.email, formData.password)} className="bg-m_blue">{selected==='signup' ? 'Sign up':"Login" }</button>
        </>
    )
}

export {AuthForm}