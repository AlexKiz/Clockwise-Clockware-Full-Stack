import axios from "axios";
import React, { useState, useEffect, FC } from "react";
import { useParams, useHistory } from "react-router-dom"
import '../user.controller/user-update-form.css'
import { Params } from '../../../types/types'


interface UserControllerProps {}

const UserController: FC<UserControllerProps> = () => {
    
    const history = useHistory()

    const [userName, setUserName] = useState<string>('')
    const [userId, setUserId] = useState<number>(0)
    const [userEmail, setUserEmail] = useState<string>('')

    const {propsUserId, propsUserName, propsUserEmail} = useParams<Params>()
    

    useEffect(() => {
        
        setUserId( +propsUserId )
        setUserName( propsUserName )
        setUserEmail( propsUserEmail )

    },[])


    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        axios.put(`/user` , 
        { 
            id: userId,
            name: userName,
            email: userEmail
        }).then(() => {
            alert('User has been updated')
            history.push('/admin/users-list')
        }).catch(() => {
            alert('User with current email already exists')
            setUserEmail( propsUserEmail )
        })
        
    }
    
    return (
        <div className='container-form'>

            <form className='form' onSubmit={onSubmit}>
                
                <div>

                    <div className='form-section'>
                        <div className='form-input__label'>
                            <label>Enter User name:</label>
                        </div>
                        <input
                        type='text'
                        pattern='^([(A-Za-zА-Яа-я]{3,49})$|^([A-Za-zА-Яа-я]{3,49}[\s]{1}[A-Za-zА-Яа-я]{3,50})$'
                        title='User name must be at least 3 letter and alphabetical characters only'
                        value={userName}
                        onChange={(userNameEvent) => setUserName(userNameEvent.target.value)}
                        >    
                        </input>
                    </div>

                    <div className='form-section'>
                        <div className='form-input__label'>
                            <label>Enter User's email:</label>
                        </div>
                        <input
                        type='email'
                        pattern='^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
                        title='Email must be according the example: myemail@mail.com'
                        value={userEmail}
                        onChange={(userEmailEvent) => setUserEmail(userEmailEvent.target.value)}
                        >
                        </input>
                    </div>

                    <div className='form-button'>
                        <button type='submit'>
                            Submit
                        </button>
                    </div>

                </div>

            </form>
        </div>
    )
}

export default UserController