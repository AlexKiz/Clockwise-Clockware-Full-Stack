import React from 'react';
import {Link} from 'react-router-dom';
import classes from './header.module.css';
import {useLocation} from 'react-router-dom';
import {languageSelect, MENU_LINKS} from './componentConstants';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {MenuItem} from '@mui/material';
import i18n from 'src/i18n/i18n';
import {useTranslation} from 'react-i18next';


const PublicHeader = () => {
	const location = useLocation();
	const {pathname} = location;
	const splitLocation = pathname.split('/').reverse();
	const {t} = useTranslation();

	const handleChangeLanguage = (event: SelectChangeEvent) => {
		i18n.changeLanguage(event.target.value);
	};

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
										{t(`${link.title}`)}
									</Link>
								</li>
							))
						}
						<li>
							<Select
								sx={{height: 29}}
								value={i18n.resolvedLanguage}
								onChange={handleChangeLanguage}
							>
								{
									languageSelect.map((elem) => (
										<MenuItem key={elem.code} value={elem.code}>{elem.name}</MenuItem>
									))
								}
							</Select>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default PublicHeader;
