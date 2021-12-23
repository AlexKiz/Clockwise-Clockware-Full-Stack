/* eslint-disable react/jsx-key */
/* eslint-disable max-len */
import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import classes from './header.module.css';
import {useLocation} from 'react-router-dom';
import {RESOURCE} from '../../data/constants/routeConstants';
import {ADMIN_MENU_LINKS} from './componentConstants';
import {Button} from '@mui/material';

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
			<div className={classes.wrapper_header}>
				<div className={classes.wrapper_logo}>
					<Link to={`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`}>
						<div className={classes.inner_logo}>
							<div className={classes.inner_logo_img}>
								<div className={classes.logo_img1a}>
									<div className={classes.logo_img1b}>
										<div className={classes.logo_img1c}></div>
									</div>
								</div>
							</div>
							<div className={classes.logo_text1d}></div>
						</div>
					</Link>
				</div>
				<nav>
					<ul className={classes.nav__links}>
						{
							ADMIN_MENU_LINKS.map((link) => (
								<li className={splitLocation[0] === link.name ? classes.active : ''}><Link to={link.path}>{`${link.title}`}</Link></li>
							))
						}
					</ul>
				</nav>
				<Button
					variant="contained"
					onClick={logout}
					className={classes.form_btn}
					style={ {fontSize: 18, backgroundColor: 'green', borderRadius: 15} }
				>
					Logout
				</Button>
			</div>
		</header>
	);
};

export default PrivateHeader;
