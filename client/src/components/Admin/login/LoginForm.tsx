import axios from 'axios';
import {RESOURCE, URL} from '../../../data/constants/routeConstants';
import React, {useState, useEffect, FC} from 'react';
import {useHistory} from 'react-router-dom';
import PublicHeader from '../../Headers/PublicHeader';
import classes from '../login/login-form.module.css';
import {LoginFormProps, validate} from './componentConstants';
import {ACCESS_TOKEN} from 'src/data/constants/systemConstants';
import {useFormik} from 'formik';
import {Button, FilledInput, FormControl, IconButton, InputAdornment, InputLabel, Stack, TextField} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import AlertMessage from 'src/components/Notification/AlertMessage';


const LoginForm:FC<LoginFormProps> = () => {
	const history = useHistory();

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [notify, setNotify] = useState<boolean>(false);

	const isOpen = (value:boolean) => {
		setNotify(value);
	};

	const formik = useFormik({
		initialValues: {
			adminLogin: '',
			adminPassword: '',
		},
		validate,
		onSubmit: async (values) => {
			const payload = {
				adminLogin: values.adminLogin,
				adminPassword: values.adminPassword,
			};

			try {
				const {headers: {authorization: accessToken}} = await axios.post(URL.LOGIN, payload);
				localStorage.setItem(ACCESS_TOKEN, accessToken.split(' ')[1]);
				history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`);
			} catch (e) {
				setNotify(true);
			}
			formik.resetForm();
		},
	});


	useEffect(() => {
		if (localStorage.getItem(ACCESS_TOKEN)) {
			history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`);
		}
	}, []);


	return (
		<div>
			<PublicHeader/>

			<div className={classes.conteiner}>
				<div className={classes.container_form}>
					<form className={classes.form} onSubmit={formik.handleSubmit}>
						<Stack direction="column" justifyContent="center" spacing={1}>
							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<label>Enter Admin Login:</label>
								</div>

								<TextField
									id="adminLogin"
									name='adminLogin'
									label="Email"
									placeholder="example@mail.com"
									variant="filled"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.adminLogin}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.adminLogin && Boolean(formik.errors.adminLogin)}
									helperText={formik.touched.adminLogin && formik.errors.adminLogin}
									required
								/>
							</div>
							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<label>Enter Admin Password:</label>
								</div>
								<FormControl fullWidth variant="filled">
									<InputLabel>Password</InputLabel>
									<FilledInput
										id="filled-adornment-password"
										type={showPassword ? 'text' : 'password'}
										value={formik.values.adminPassword}
										onChange={formik.handleChange('adminPassword')}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={() => setShowPassword((showPassword) => !showPassword)}
													edge="end"
												>
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										}
									/>
								</FormControl>
							</div>
							<div className={classes.form_section}>
								<Button
									variant="contained"
									type="submit"
									className={classes.form_btn}
									style={ {fontSize: 18, backgroundColor: 'green', borderRadius: 15} }
								>
										Sign In
								</Button>
							</div>
						</Stack>
					</form>
				</div>
				{
					notify && <AlertMessage alertType='error' message='Incorrect logging data' isOpen={isOpen} notify={notify}/>
				}
			</div>
		</div>
	);
};

export default LoginForm;
