import axios from 'axios';
import {RESOURCE, URL} from '../../../data/constants/routeConstants';
import React, {useState, useEffect, FC} from 'react';
import {useHistory} from 'react-router-dom';
import PublicHeader from '../../Headers/PublicHeader';
import classes from './login-form.module.css';
import {LoginFormProps, validate} from './componentConstants';
import {ACCESS_TOKEN, ROLE} from 'src/data/constants/systemConstants';
import {useFormik} from 'formik';
import {
	Button,
	FilledInput,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	Stack,
	TextField,
	Typography,
	CircularProgress,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import jwtDecode from 'jwt-decode';
import {BearerParser} from 'bearer-token-parser';


const LoginForm:FC<LoginFormProps> = () => {
	const history = useHistory();

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [notify, setNotify] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const isOpen = (value:boolean) => {
		setNotify(value);
	};

	const formik = useFormik({
		initialValues: {
			login: '',
			password: '',
		},
		validate,
		onSubmit: async (values) => {
			try {
				setLoading(true);
				const login = await axios.post(URL.LOGIN, {
					login: values.login,
					password: values.password,
				});
				const token = BearerParser.parseBearerToken(login.headers);
				localStorage.setItem(ACCESS_TOKEN, token);

				if (login.data.role === ROLE.ADMIN) {
					history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`);
				} else if (login.data.role === ROLE.MASTER) {
					history.push(`/${RESOURCE.MASTER}/${RESOURCE.ORDERS_LIST}`);
				} else if (login.data.role === ROLE.CLIENT) {
					history.push(`/${RESOURCE.CLIENT}/${RESOURCE.ORDERS_LIST}`);
				}
			} catch (e) {
				setLoading(false);
				setNotify(true);
			}
			formik.resetForm();
		},
	});


	useEffect(() => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			const {role} = jwtDecode<{role: string}>(token);

			if (role === ROLE.ADMIN) {
				history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`);
			} else if (role === ROLE.MASTER) {
				history.push(`/${RESOURCE.MASTER}/${RESOURCE.ORDERS_LIST}`);
			} else if (role === ROLE.CLIENT) {
				history.push(`/${RESOURCE.CLIENT}/${RESOURCE.ORDERS_LIST}`);
			}
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
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										Enter Admin Login:
									</Typography>
								</div>
								<TextField
									id="login"
									name='login'
									label="Email"
									placeholder="example@mail.com"
									variant="filled"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.login}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.login && Boolean(formik.errors.login)}
									helperText={formik.touched.login && formik.errors.login}
									required
								/>
							</div>
							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										Enter Admin Password:
									</Typography>
								</div>
								<FormControl fullWidth variant="filled">
									<InputLabel>Password</InputLabel>
									<FilledInput
										id="filled-adornment-password"
										type={showPassword ? 'text' : 'password'}
										value={formik.values.password}
										onChange={formik.handleChange('password')}
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
									color='success'
									className={classes.form_btn}
									style={ {fontSize: 18, borderRadius: 15} }
									disabled={loading}
								>
									Sign In
									{loading && <CircularProgress
										size={56}
										color="success"
										sx={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											marginTop: '-28px',
											marginLeft: '-28px',
										}}
									/>}
								</Button>
							</div>
						</Stack>
					</form>
				</div>
				{
					notify &&
					<AlertMessage
						alertType='error'
						message='Incorrect logging data'
						isOpen={isOpen}
						notify={notify}
					/>
				}
			</div>
		</div>
	);
};

export default LoginForm;
