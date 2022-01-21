import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import PublicHeader from '../../../Headers/PublicHeader';
import classes from './registration-form.module.css';
import {RegistrationProps, validate} from './componentConstants';
import {useFormik} from 'formik';
import {URL} from '../../../../data/constants/routeConstants';
import {
	Button,
	Checkbox,
	FilledInput,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	TextField,
	Typography,
	CircularProgress,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {City} from 'src/data/types/types';
import AlertMessage from 'src/components/Notification/AlertMessage';


const Registration:FC<RegistrationProps> = () => {
	const [cities, setCities] = useState<City[]>([]);

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [notify, setNotify] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const isOpen = (value:boolean) => {
		setNotify(value);
	};

	const formik = useFormik({
		initialValues: {
			email: '',
			firstName: '',
			lastName: '',
			password: '',
			checkPassword: '',
			licenseAcception: false,
			isMaster: false,
			citiesId: [] as number[],

		},
		validate,
		onSubmit: async (values) => {
			setLoading(true);
			await axios.post(URL.REGISTRATION,
				{
					email: values.email,
					name: `${values.firstName} ${values.lastName}`,
					password: values.password,
					citiesId: values.citiesId,
					role: values.isMaster ? 'master' : 'client',
				}).then(() => {
				setLoading(false);
				setNotify(true);
				values.licenseAcception = false,
				values.isMaster = false,
				formik.resetForm();
			});
		},
	});

	useEffect(() => {
		const readCitiesData = async () => {
			const {data} = await axios.get<City[]>(URL.CITY);

			if (data.length) {
				setCities(data);
			}
		};

		readCitiesData();
	}, []);


	return (
		<div>
			<PublicHeader/>
			<div className={classes.container}>
				<div className={classes.container_form}>
					<form className={classes.form} onSubmit={formik.handleSubmit}>
						<Stack direction='column' justifyContent='center' spacing={1}>
							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										Enter Email:
									</Typography>
								</div>
								<TextField
									id="email"
									name='email'
									label="Email"
									placeholder="example@mail.com"
									variant="filled"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.email}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.email && Boolean(formik.errors.email)}
									helperText={formik.touched.email && formik.errors.email}
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
										Enter Password:
									</Typography>
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
									<FormHelperText error> {formik.touched.checkPassword && formik.errors.checkPassword} </FormHelperText>
								</FormControl>
							</div>
							<div className={classes.from_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										Enter your name:
									</Typography>
								</div>
								<TextField
									id="firstName"
									name='firstName'
									label="First Name"
									placeholder="First Name"
									variant="filled"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.firstName}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.firstName && Boolean(formik.errors.firstName)}
									helperText={formik.touched.firstName && formik.errors.firstName}
									required
								/>
								<TextField
									id="lastName"
									name='lastName'
									label="Last Name"
									placeholder="Last Name"
									variant="filled"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.lastName}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.lastName && Boolean(formik.errors.lastName)}
									helperText={formik.touched.lastName && formik.errors.lastName}
									required
								/>
							</div>
							<div className={classes.form_section}>
								<FormControl
									required
									error={formik.touched.licenseAcception && Boolean(formik.errors.licenseAcception)}
									component="fieldset"
									sx={{m: 3, width: '100%'}}
									variant="outlined"
								>
									<FormGroup row>
										<FormControlLabel
											control={
												<Checkbox
													onChange={formik.handleChange('licenseAcception')}
													checked={formik.values.licenseAcception}
													required
												/>
											}
											label="*Accept the license terms"
										/>
										<FormControlLabel
											control={
												<Checkbox
													onChange={formik.handleChange('isMaster')}
													checked={formik.values.isMaster}
													value=''
												/>
											}
											label="Sign up as master"
										/>
									</FormGroup>
									<FormHelperText error>
										{formik.touched.licenseAcception && Boolean(formik.errors.licenseAcception)}
									</FormHelperText>
								</FormControl>
							</div>

							{ formik.values.isMaster &&
								<div className={classes.form_section}>
									<div className={classes.form_input__label}>
										<Typography
											variant="h6"
											gutterBottom
											component="label"
										>
											Choose сities:
										</Typography>
									</div>
									<FormControl
										fullWidth
										error={formik.touched.citiesId && Boolean(formik.errors.citiesId)}
									>
										<InputLabel id="cities">Cities</InputLabel>
										<Select
											id='citiesId'
											name='citiesId'
											labelId='cities'
											placeholder='City'
											displayEmpty
											multiple
											onChange={formik.handleChange}
											value={formik.values.citiesId}
											onBlur={formik.handleBlur}
											input={<OutlinedInput label="Cities" />}
										>
											{cities.map((city) => (
												<MenuItem
													key={city.id}
													value={city.id}
												>
													{city.name}
												</MenuItem>
											))}
										</Select>
										<FormHelperText> {formik.touched.citiesId && formik.errors.citiesId} </FormHelperText>
									</FormControl>
								</div>
							}
							<div className={classes.form_section}>
								<Button
									disabled={!(formik.isValid && formik.dirty && !loading)}
									color='success'
									variant="contained"
									type="submit"
									className={classes.form_btn}
									style={ {fontSize: 18, borderRadius: 15} }
								>
								Submit
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
					{
						notify &&
						<AlertMessage
							alertType='success'
							message='Check your email to verify account'
							isOpen={isOpen}
							notify={notify}
						/>
					}
				</div>
			</div>
		</div>
	);
};

export default Registration;
