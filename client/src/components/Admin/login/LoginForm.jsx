import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"
import PublicHeader from "../../Headers/PublicHeader";
import '../login/login-form.css'


const LoginForm = () => {

    const history = useHistory()
    
    const [adminLogin, setAdminLogin] = useState('')
    const [adminPassword, setAdminPassword] = useState('')

    useEffect(() => {
        if(localStorage.getItem('accessToken')) {
            history.push('/admin/orders-list')
        }
    },[])
    

    const onSubmit = async (event) => {
        event.preventDefault()
        const payload = {
            adminLogin,
            adminPassword
        }

        try{

            const { headers:{ authorization: accessToken } } = await axios.post('/login', payload)
            localStorage.setItem('accessToken', accessToken.split(' ')[1])
            history.push('/admin/orders-list')

        } catch(e) {

            alert('Incorrect logging data')
            setAdminPassword('')
        }
    }

    return (
        <div>
            <PublicHeader/>

            <div className='container-form'>
                <form className='form' onSubmit={onSubmit}>
                    <div>
                        <div className='form-section'>
                            <div  className='form-input__label'>
                                <label>Enter Admin Login:</label>
                            </div>
                            <input
                            placeholder='Email'
                            type='email' 
                            name='login'
                            value={adminLogin}
                            onChange = {(adminLoginEvent) => setAdminLogin(adminLoginEvent.target.value)}
                            required
                            >
                            </input>
                        </div>
                        <div className='form-section'>
                            <div  className='form-input__label'>
                                <label>Enter Admin Password:</label>
                            </div>
                            <input
                            placeholder='Password'
                            type='password' 
                            name='password'
                            value={adminPassword}
                            onChange = {(adminPasswordEvent) => setAdminPassword(adminPasswordEvent.target.value)}
                            >
                            </input>
                        </div>
                        <div  className='form-button'>
                            <button type='submit'>Sign In</button>
                        </div>
                    </div>
                </form>
            </div>
            
        </div>
    )
}

export default LoginForm