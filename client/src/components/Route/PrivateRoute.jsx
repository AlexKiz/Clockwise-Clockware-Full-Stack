/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable react/react-in-jsx-scope */
import {useEffect} from 'react';
import {Route, Redirect, useHistory} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import PrivateHeader from '../Headers/PrivateHeader';
import {RESOURCE} from '../../data/constants/routeConstants';
import {ACCESS_TOKEN} from 'src/data/constants/systemConstants';

const PrivateRoute = ({component: Component, ...rest}) => {
	const history = useHistory();

	useEffect(() => {
		if (!localStorage.getItem(ACCESS_TOKEN)) {
			alert('You must be authorizated');
			history.push(`/${RESOURCE.LOGIN}`);
		} else if ((jwt_decode(localStorage.getItem(ACCESS_TOKEN))).exp < Number((Date.now()/1000).toFixed())) {
			localStorage.removeItem(ACCESS_TOKEN);
			history.push(`/${RESOURCE.LOGIN}`);
		}
	});


	return (
		<Route {...rest}
			render = {(props) => localStorage.getItem(ACCESS_TOKEN) ? (
				<>
					<PrivateHeader/>
					<Component {...props}/>
				</>
			) : (
				<Redirect to={`/${RESOURCE.LOGIN}`}/>
			)}
		/>
	);
};

export default PrivateRoute;
