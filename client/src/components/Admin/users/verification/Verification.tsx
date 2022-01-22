import axios from 'axios';
import React, {useEffect, FC, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import classes from './verification.module.css';
import {URL} from '../../../../data/constants/routeConstants';
import {Params} from 'src/data/types/types';
import {
	Button,
	FilledInput,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	Stack,
} from '@mui/material';
import {VerificationProps, validate} from './componentConstants';
import {useFormik} from 'formik';
import {Visibility, VisibilityOff} from '@mui/icons-material';


const Verification: FC<VerificationProps> = () => {
	const history = useHistory();

	const {hashVerify, generated} = useParams<Params>();
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const formik = useFormik({
		initialValues: {
			password: '',
			checkPassword: '',
		},
		validate,
		onSubmit: async (values) => {
			await axios.put(URL.VERIFY,
				{
					hashVerify,
					password: values.password,
				}).then(() => {
				history.push(URL.LOGIN);
			});
		},
	});

	useEffect(() => {
		const verifyUser = async () => {
			await axios.put(URL.VERIFY, {
				hashVerify,
			}).then((response) => {
				const [isUserVerified] = response.data;
				if (!isUserVerified) {
					history.push(URL.LOGIN);
				}
			}).catch((error) => {
				if (Number(error.response.status) === 404) {
					history.push(URL.LOGIN);
				}
			});
		};

		verifyUser();
	}, []);


	const handleOnClick = () => {
		history.push(URL.LOGIN);
	};

	return (
		<div>
			<div className={classes.container}>
				<div className={classes.container_notification}>
					{generated ?
						<Stack direction='column' justifyContent='center' spacing={2}>
							<div className={classes.form_label}>
								<label>You have verified your email!</label>
							</div>

							<div className={classes.form_section}>
								<Button
									variant="contained"
									onClick={handleOnClick}
									className={classes.btn}
									style={ {fontSize: 22, backgroundColor: 'green', borderRadius: 15} }
								>
									GO TO MAIN PAGE
								</Button>
							</div>
						</Stack> :

						<form className={classes.form} onSubmit={formik.handleSubmit}>
							<Stack direction='column' justifyContent='center' spacing={2}>
								<div className={classes.form_section}>
									<div className={classes.form_label}>
										<label>Enter your password:</label>
									</div>

									<FormControl fullWidth variant="filled">
										<InputLabel>Password</InputLabel>
										<FilledInput
											id="filled-adornment-password"
											type={showPassword ? 'text' : 'password'}
											value={formik.values.password}
											onChange={formik.handleChange('password')}
											onBlur={formik.handleBlur('password')}
											error={formik.touched.password && Boolean(formik.errors.password)}
											required
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
										<FormHelperText error> {formik.touched.password && formik.errors.password} </FormHelperText>
									</FormControl>

									<FormControl fullWidth variant="filled">
										<InputLabel>Confirm password</InputLabel>
										<FilledInput
											id="filled-adornment-password"
											type={showPassword ? 'text' : 'password'}
											value={formik.values.checkPassword}
											onChange={formik.handleChange('checkPassword')}
											onBlur={formik.handleBlur('checkPassword')}
											error={formik.touched.checkPassword && Boolean(formik.errors.checkPassword)}
											required
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
										<FormHelperText error>
											{formik.touched.checkPassword && formik.errors.checkPassword}
										</FormHelperText>
									</FormControl>
								</div>
								<div className={classes.form_section}>
									<Button
										variant="contained"
										type="submit"
										className={classes.form_btn}
										style={ {fontSize: 18, backgroundColor: 'green', borderRadius: 15} }
									>
										Submit and verify
									</Button>
								</div>
							</Stack>
						</form>
					}
				</div>
			</div>
		</div>
	);
};

export default Verification;
