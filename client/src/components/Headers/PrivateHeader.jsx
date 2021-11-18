import {Link, useHistory} from 'react-router-dom'
import './header.css'
import logo from "../../img/logo1.png"
import { useLocation } from "react-router-dom";

const PrivateHeader = () => {

    const history = useHistory()
    const location = useLocation()
    const { pathname } = location

    const logout = () => {
        localStorage.removeItem('accessToken')
        history.push('/login')
    }

    const splitLocation = pathname.split('/')
    
    return (
            <header>
                <div className='wrapper-header'>
                    <div className='wrapper-logo'>
                        <Link to='/admin/orders-list'>
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
                            <li className={splitLocation[splitLocation.length - 1] === "users-list" ? "active" : ""}><Link to='/admin/users-list'>User Controller</Link></li>
                            <li className={splitLocation[splitLocation.length - 1] === "cities-list" ? "active" : ""}><Link to='/admin/cities-list'>City Controller</Link></li>
                            <li className={splitLocation[splitLocation.length - 1] === "masters-list" ? "active" : ""}><Link to='/admin/masters-list'>Master Controller</Link></li>
                            <li className={splitLocation[splitLocation.length - 1] === "orders-list" ? "active" : ""}><Link to='/admin/orders-list'>Order Controller</Link></li>
                        </ul>
                    </nav>
                    <button className='header-button' onClick={logout}>Logout</button>
                </div>
            </header>
    )
}

export default PrivateHeader