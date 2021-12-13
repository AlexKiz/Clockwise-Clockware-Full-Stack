/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable react/react-in-jsx-scope */
import {useEffect} from 'react';
import {Route, Redirect, useHistory} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import PrivateHeader from '../Headers/PrivateHeader';
import {RESOURCE} from '../../data/constants/routeConstants';
import {ACCESSTOKEN} from 'src/data/constants/systemConstants';

const PrivateRoute = ({component: Component, ...rest}) => {
	const history = useHistory();

	useEffect(() => {
		if (!localStorage.getItem(ACCESSTOKEN)) {
			alert('You must be authorizated'); // alert -
			history.push(`/${RESOURCE.LOGIN}`);
		} else if ((jwt_decode(localStorage.getItem(ACCESSTOKEN))).exp < Number((Date.now()/1000).toFixed())) {
			localStorage.removeItem(ACCESSTOKEN);
			history.push(`/${RESOURCE.LOGIN}`);
		}
	});


	return (
		<Route {...rest}
			render = {(props) => localStorage.getItem(ACCESSTOKEN) ? (
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
