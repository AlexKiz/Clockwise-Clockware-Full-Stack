/* eslint-disable react/jsx-key */
/* eslint-disable max-len */
import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import './header.css';
import {useLocation} from 'react-router-dom';
import {RESOURCE} from '../../data/constants/routeConstants';
import {PRIVATE_MENU_LINKS} from './componentConstants';

const PrivateHeader = () => {
	const history = useHistory();
	const location = useLocation();
	const {pathname} = location;

	const logout = () => {
		localStorage.removeItem('accessToken');
		history.push(`/${RESOURCE.LOGIN}`);
	};

	const splitLocation = pathname.split('/').reverse();

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
						{
							PRIVATE_MENU_LINKS.map((link) => (
								<li className={splitLocation[0] === link.name ? 'active' : ''}><Link to={link.path}>{`${link.title}`}</Link></li>
							))
						}
					</ul>
				</nav>
				<button className='header-button' onClick={logout}>Logout</button>
			</div>
		</header>
	);
};

export default PrivateHeader;
