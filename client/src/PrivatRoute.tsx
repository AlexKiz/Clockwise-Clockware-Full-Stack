import { useEffect } from 'react'
import { Route, Redirect, useHistory } from "react-router-dom"
import jwt_decode from "jwt-decode";
import PrivateHeader from './components/Headers/PrivateHeader';

const PrivatRoute = ({ component: Component, ...rest }) => {

    const history = useHistory()

    useEffect(() => {

        if(!localStorage.getItem('accessToken')) {
            alert('You must be authorizated')
            history.push('/login')
        } else if((jwt_decode(localStorage.getItem('accessToken'))).exp < +(Date.now()/1000).toFixed()){
            localStorage.removeItem('accessToken')
            history.push('/login');
        }

    })


    return (
        <Route {...rest} 
        render = {props => localStorage.getItem('accessToken') ? (
            <>
            <PrivateHeader/>
            <Component {...props}/>
            </>
        ) : (
            <Redirect to='/login'/>
        )}
        />
    )
}

export default PrivatRoute