import axios from 'axios';
import {RESOURCE, URL} from '../../../data/constants/routeConstants';
import React, {useEffect, useState, FC} from 'react';
import {useHistory} from 'react-router-dom';
import PublicHeader from '../../Headers/PublicHeader';
import '../login/login-form.css';
import {LoginFormProps} from './componentConstants';
import {ACCESSTOKEN} from 'src/data/constants/systemConstants';

const LoginForm:FC<LoginFormProps> = () => {
	const history = useHistory();

	const [adminLogin, setAdminLogin] = useState<string>('');
	const [adminPassword, setAdminPassword] = useState<string>('');

	useEffect(() => {
		if (localStorage.getItem(ACCESSTOKEN)) {
			history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`);
		}
	}, []);


	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const payload = {
			adminLogin,
			adminPassword,
		};

		try {
			const {headers: {authorization: accessToken}} = await axios.post(URL.LOGIN, payload);
			localStorage.setItem(ACCESSTOKEN, accessToken.split(' ')[1]);
			history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`);
		} catch (e) {
			alert('Incorrect logging data');
			setAdminPassword('');
		}
	};

	return (
		<div>
			<PublicHeader/>

			<div className='container-form'>
				<form className='form' onSubmit={onSubmit}>
					<div>
						<div className='form-section'>
							<div className='form-input__label'>
								<label>Enter Admin Login:</label>
							</div>
							<input
								placeholder='Email'
								type='email'
								name='login'
								value={adminLogin}
								onChange = {(adminLoginEvent) => setAdminLogin(adminLoginEvent.target.value)}
								required
							>
							</input>
						</div>
						<div className='form-section'>
							<div className='form-input__label'>
								<label>Enter Admin Password:</label>
							</div>
							<input
								placeholder='Password'
								type='password'
								name='password'
								value={adminPassword}
								onChange = {(adminPasswordEvent) => setAdminPassword(adminPasswordEvent.target.value)}
							>
							</input>
						</div>
						<div className='form-button'>
							<button type='submit'>Sign In</button>
						</div>
					</div>
				</form>
			</div>

		</div>
	);
};

export default LoginForm;
