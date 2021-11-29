import { useEffect } from 'react'
import { Route, Redirect, useHistory } from "react-router-dom"
import jwt_decode from "jwt-decode";
import PrivateHeader from '../Headers/PrivateHeader';
import { RESOURCE } from '../../data/constants/routeConstants';

const PrivatRoute = ({ component: Component, ...rest }) => {

    const history = useHistory()

    useEffect(() => {

        if(!localStorage.getItem('accessToken')) {
            alert('You must be authorizated')
            history.push(`/${RESOURCE.LOGIN}`)
        } else if((jwt_decode(localStorage.getItem('accessToken'))).exp < Number((Date.now()/1000).toFixed())){
            localStorage.removeItem('accessToken')
            history.push(`/${RESOURCE.LOGIN}`);
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
            <Redirect to={`/${RESOURCE.LOGIN}`}/>
        )}
        />
    )
}

export default PrivatRoute