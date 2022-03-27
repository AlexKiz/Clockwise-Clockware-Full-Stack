import React, {useEffect} from 'react';
import {Route, Redirect, useHistory} from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {RESOURCE} from '../../data/constants/routeConstants';
import {ACCESS_TOKEN} from 'src/data/constants/systemConstants';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({component: Component, ...rest}) => {
	const history = useHistory();

	useEffect(() => {
		if (!localStorage.getItem(ACCESS_TOKEN)) {
			history.push(`/${RESOURCE.LOGIN}`);
		} else if ((jwtDecode(localStorage.getItem(ACCESS_TOKEN))).exp < Number((Date.now()/1000).toFixed())) {
			localStorage.removeItem(ACCESS_TOKEN);
			history.push(`/${RESOURCE.LOGIN}`);
		}
	});


	return (
		<Route {...rest}
			render = {(props) => localStorage.getItem(ACCESS_TOKEN) ? (
				<>
					<Component {...props}/>
				</>
			) : (
				<Redirect to={`/${RESOURCE.LOGIN}`}/>
			)}
		/>
	);
};

export default PrivateRoute;
