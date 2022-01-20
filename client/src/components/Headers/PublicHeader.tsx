import React from 'react';
import {Link} from 'react-router-dom';
import classes from './header.module.css';
import {useLocation} from 'react-router-dom';
import {MENU_LINKS} from './componentConstants';

const PublicHeader = () => {
	const location = useLocation();
	const {pathname} = location;
	const splitLocation = pathname.split('/').reverse();


	return (
		<header>
			<div className={classes.wrapper_header}>
				<div className={classes.wrapper_logo}>
					<Link to='/'>
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
							MENU_LINKS.map((link) => (
								<li
									className={splitLocation[0] === link.name ? classes.active : ''}
									key={link.path}
								>
									<Link to={link.path}>
										{`${link.title}`}
									</Link>
								</li>
							))
						}
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default PublicHeader;
