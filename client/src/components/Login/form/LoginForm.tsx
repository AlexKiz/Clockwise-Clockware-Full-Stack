import axios from 'axios';
import {RESOURCE, URL} from '../../../data/constants/routeConstants';
import React, {useState, useEffect, FC} from 'react';
import {useHistory} from 'react-router-dom';
import PublicHeader from '../../Headers/PublicHeader';
import classes from '../login/login-form.module.css';
import {LoginFormProps, RoleChecking, validate} from './componentConstants';
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
} from '@mui/material';
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
			userLogin: '',
			userPassword: '',
		},
		validate,
		onSubmit: async (values) => {
			const payload = {
				userLogin: values.userLogin,
				userPassword: values.userPassword,
			};

			try {
				const login = await axios.post(URL.LOGIN, payload);
				localStorage.setItem(ACCESS_TOKEN, login.headers.authorization.split(' ')[1]);

				if (login.data.role === ROLE.ADMIN) {
					history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`);
				} else if (login.data.role === ROLE.MASTER) {
					history.push(`/${RESOURCE.MASTER}/${RESOURCE.ORDERS_LIST}`);
				}
			} catch (e) {
				setNotify(true);
			}
			formik.resetForm();
		},
	});


	useEffect(() => {
		if (localStorage.getItem(ACCESS_TOKEN)) {
			const checkRole = async () => {
				const {data} = await axios.get<RoleChecking>(URL.LOGIN, {
					params: {
						token: localStorage.getItem(ACCESS_TOKEN),
					},
				});

				if (data && data.role === ROLE.ADMIN) {
					history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`);
				} else if (data && data.role === ROLE.MASTER) {
					history.push(`/${RESOURCE.MASTER}/${RESOURCE.ORDERS_LIST}`);
				}
			};
			checkRole();
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
									id="adminLogin"
									name='adminLogin'
									label="Email"
									placeholder="example@mail.com"
									variant="filled"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.userLogin}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.userLogin && Boolean(formik.errors.userLogin)}
									helperText={formik.touched.userLogin && formik.errors.userLogin}
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
										value={formik.values.userPassword}
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
