import axios from "axios";
import React, { useState, useEffect, FC } from "react";
import { useParams, useHistory } from "react-router-dom"
import '../user.controller/user-update-form.css'
import { Params } from '../../../data/types/types'
import { UserControllerProps } from "./componentConstant";
import { RESOURCE, URL } from "../../../data/constants/routeConstants";

const UserController: FC<UserControllerProps> = () => {
    
    const history = useHistory()

    const [userName, setUserName] = useState<string>('')
    const [userId, setUserId] = useState<number>(0)
    const [userEmail, setUserEmail] = useState<string>('')

    const { userIdParam, userNameParam, userEmailParam } = useParams<Params>()
    

    useEffect(() => {
        
        setUserId( Number(userIdParam) )
        setUserName( userNameParam )
        setUserEmail( userEmailParam )

    },[])


    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        axios.put(`/${URL.USER}` , 
        { 
            id: userId,
            name: userName,
            email: userEmail
        }).then(() => {
            alert('User has been updated')
            history.push(`/${RESOURCE.ADMIN}/${RESOURCE.USERS_LIST}`)
        }).catch(() => {
            alert('User with current email already exists')
            setUserEmail( userEmailParam )
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