import axios from 'axios';
import {URL} from '../../../data/constants/routeConstants';
import React, {useState, useEffect, FC} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import PublicHeader from '../../Headers/PublicHeader';
import classes from './login-form.module.css';
import {LoginFormProps, roleMappingLoginPaths, validate} from './componentConstants';
import {ACCESS_TOKEN} from 'src/data/constants/systemConstants';
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
import {useTranslation} from 'react-i18next';
import {AlertNotification, Params} from 'src/data/types/types';


const LoginForm:FC<LoginFormProps> = () => {
	const history = useHistory();

	const {t} = useTranslation();
	const {paymentMessage} = useParams<Params>();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		message: '',
		type: 'success',
		notify: false,
	});
	const [loading, setLoading] = useState<boolean>(false);

	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
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

				history.push(roleMappingLoginPaths[login.data.role]);
			} catch (e) {
				setLoading(false);
				setAlertOptions({
					message: 'Incorrect logging data',
					type: 'error',
					notify: true,
				});
			}
			formik.resetForm();
		},
	});


	useEffect(() => {
		if (paymentMessage === 'success') {
			setAlertOptions({
				message: 'Your order has been created! Please rate the master afterwards!',
				type: 'success',
				notify: true,
			});
		} else if (paymentMessage === 'error') {
			setAlertOptions({
				message: 'Something went wrong while payment',
				type: 'error',
				notify: true,
			});
		}
	}, []);


	useEffect(() => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			const {role} = jwtDecode<{role: string}>(token);

			history.push(roleMappingLoginPaths[role]);
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
										{t('login.userLogin')}
									</Typography>
								</div>
								<TextField
									id="login"
									name='login'
									label={t('labels.email')}
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
										{t('login.userPassword')}
									</Typography>
								</div>
								<FormControl fullWidth variant="filled">
									<InputLabel>{t('labels.password')}</InputLabel>
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
									{t('buttons.signIn')}
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
					alertOptions.notify &&
					<AlertMessage
						alertType={alertOptions.type}
						message={alertOptions.message}
						isOpen={isOpen}
						notify={alertOptions.notify}
					/>
				}
			</div>
		</div>
	);
};

export default LoginForm;
