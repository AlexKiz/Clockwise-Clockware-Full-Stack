/* eslint-disable max-len */
import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import './header.css';
import {useLocation} from 'react-router-dom';
import {RESOURCE} from '../../data/constants/routeConstants';

const PrivateHeader = () => {
	const history = useHistory();
	const location = useLocation();
	const {pathname} = location;

	const logout = () => {
		localStorage.removeItem('accessToken');
		history.push(`/${RESOURCE.LOGIN}`);
	};

	const splitLocation = pathname.split('/');

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
						<li className={splitLocation[splitLocation.length - 1] === `${RESOURCE.USERS_LIST}` ? 'active' : ''}><Link to={`/${RESOURCE.ADMIN}/${RESOURCE.USERS_LIST}`}>User Controller</Link></li>
						<li className={splitLocation[splitLocation.length - 1] === `${RESOURCE.CITIES_LIST}` ? 'active' : ''}><Link to={`/${RESOURCE.ADMIN}/${RESOURCE.CITIES_LIST}`}>City Controller</Link></li>
						<li className={splitLocation[splitLocation.length - 1] === `${RESOURCE.MASTERS_LIST}` ? 'active' : ''}><Link to={`/${RESOURCE.ADMIN}/${RESOURCE.MASTERS_LIST}`}>Master Controller</Link></li>
						<li className={splitLocation[splitLocation.length - 1] === `${RESOURCE.ORDERS_LIST}` ? 'active' : ''}><Link to={`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`}>Order Controller</Link></li>
					</ul>
				</nav>
				<button className='header-button' onClick={logout}>Logout</button>
			</div>
		</header>
	);
};

export default PrivateHeader;
