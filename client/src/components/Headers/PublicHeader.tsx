import React from 'react';
import {Link} from 'react-router-dom'
import './header.css'
import { useLocation } from "react-router-dom";
import { RESOURCE } from '../../data/constants/routeConstants';

const PublicHeader = () => {

    const location = useLocation()
    const { pathname } = location
    const splitLocation = pathname.split('/')


    return (
        <header>
            <div className='wrapper-header'>
                <div className='wrapper-logo'>
                    <Link to='/'>
                        <div className='inner-logo'>
                            <div className='inner-logo-img'>
                                <div className='logo-img1a'>
                                    <div className='logo-img1b'>
                                        <div className='logo-img1c'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='logo-text1d'></div>
                        </div>
                    </Link>
                </div>
                <nav>
                    <ul className='nav__links'>
                        <li className={splitLocation[splitLocation.length - 1] === "" ? "active" : ""}><Link to='/'>Make order</Link></li> 
                        <li className={splitLocation[splitLocation.length - 1] === `${RESOURCE.LOGIN}` ? "active" : ""}><Link to={`/${RESOURCE.LOGIN}`}>Login</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default PublicHeader