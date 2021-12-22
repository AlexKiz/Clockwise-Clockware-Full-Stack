/* eslint-disable react/jsx-key */
import React, {useState, useEffect, FC} from 'react';
import axios from 'axios';
import classes from './order-form.module.css';
import {Master, City, Clock} from '../../../data/types/types';
import {OPENING_HOURS} from '../../../data/constants/systemConstants';
import {OrderFormProps, validate} from './componentConstants';
import {URL} from '../../../data/constants/routeConstants';
import {format} from 'date-fns';
import {Button, Stack, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText, AlertColor} from '@mui/material';
import PublicHeader from '../../Headers/PublicHeader';
import {useFormik} from 'formik';
import AlertMessage from 'src/components/Notification/AlertMessage';
import {getOrderDates} from 'src/data/utilities/systemUtilities';


const OrderForm: FC<OrderFormProps> = () => {
	const [masters, setMasters] = useState<Master[]>([]);
	const [cities, setCities] = useState<City[]>([]);
	const [clocks, setClocks] = useState<Clock[]>([]);

	const [notify, setNotify] = useState<boolean>(false);
	const [alertType, setAlertType] = useState<AlertColor>('success');
	const [message, setMessage] = useState<string>('');

	const isOpen = (value:boolean) => {
		setNotify(value);
	};

	const formik = useFormik({
		initialValues: {
			userName: '',
			userEmail: '',
			cityId: 0,
			clockId: 0,
			orderDate: '',
			orderTime: '',
			masterId: '',
		},
		validate,
		onSubmit: async (values) => {
			if (clocks.length) {
				const [startDate, endDate] = getOrderDates(clocks, formik.values.orderDate, formik.values.orderTime, formik.values.clockId);

				await axios.post(URL.ORDER,
					{
						name: values.userName,
						email: values.userEmail,
						clockId: values.clockId,
						cityId: values.cityId,
						masterId: values. masterId,
						startWorkOn: startDate,
						endWorkOn: endDate,
					}).then(() => {
					setAlertType('success');
					setMessage('Your order has been created! Please rate the master afterwards!');
					setNotify(true);
					formik.resetForm();
				});
			}
		},
	});


	useEffect(() => {
		const readCitiesData = async () => {
			const {data} = await axios.get<City[]>(URL.CITY_FOR_ORDER);
			if (data.length) {
				setCities(data);
			}
		};

		readCitiesData();
	}, []);


	useEffect(() => {
		const readClocksData = async () => {
			const {data} = await axios.get<Clock[]>(URL.CLOCK);

			if (data.length) {
				setClocks(data);
			}
		};

		readClocksData();
	}, []);


	useEffect(() => {
		const readAvailableMastersData = async () => {
			if (clocks.length) {
				const [startDate, endDate] = getOrderDates(clocks, formik.values.orderDate, formik.values.orderTime, formik.values.clockId);

				if (formik.values.cityId && formik.values.orderDate && formik.values.orderTime && formik.values.clockId) {
					const {data} = await axios.get<Master[]>(URL.AVAILABLE_MASTER, {
						params: {
							cityId: formik.values.cityId,
							startWorkOn: startDate,
							endWorkOn: endDate,
						},
					});

					if (!data.length) {
						setMessage('All masters has been booked at that time. Please choose another time or date');
						setAlertType('warning');
						setNotify(true);
						setMasters([]);
					} else {
						setMasters(data);
					}
				}
			}
		};
		readAvailableMastersData();
	}, [formik.values.cityId, formik.values.clockId, formik.values.orderDate, formik.values.orderTime]);


	return (
		<div>
			<PublicHeader/>
			<div className={classes.conteiner}>

				<div className={classes.container_form}>

					<form className={classes.form} onSubmit={formik.handleSubmit}>

						<Stack direction="column" justifyContent="center" spacing={1.5}>

							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<label>Enter your name:</label>
								</div>
								<TextField
									id="userName"
									name="userName"
									label="Full name"
									placeholder="Ivan Ivanov"
									variant="filled"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.userName}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.userName && Boolean(formik.errors.userName)}
									helperText={formik.touched.userName && formik.errors.userName}
									required
								/>
							</div>

							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<label>Enter your email:</label>
								</div>

								<TextField
									id="userEmail"
									name='userEmail'
									label="Email"
									placeholder="example@mail.com"
									variant="filled"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.userEmail}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.userEmail && Boolean(formik.errors.userEmail)}
									helperText={formik.touched.userEmail && formik.errors.userEmail}
									required
								/>
							</div>

							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<label>Choose clocksize:</label>
								</div>

								<FormControl
									fullWidth
									error={formik.touched.clockId && Boolean(formik.errors.clockId)}
								>
									<InputLabel id="clockId">Size</InputLabel>
									<Select
										id='clockId'
										name='clockId'
										labelId="clockId"
										displayEmpty
										onChange={formik.handleChange}
										value={formik.values.clockId || ''}
										label="Size"
										onBlur={formik.handleBlur}
										required
									>
										{
											clocks.map((clock) => (
												<MenuItem value={clock.id}>
													{`${clock.size}`}
												</MenuItem>
											))
										}
									</Select>
									<FormHelperText> {formik.touched.clockId && formik.errors.clockId} </FormHelperText>
								</FormControl>
							</div>

							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<label>Choose your city:</label>
								</div>

								<FormControl
									fullWidth
									error={formik.touched.cityId && Boolean(formik.errors.cityId)}
								>
									<InputLabel id="cityId">City</InputLabel>
									<Select
										id='cityId'
										name='cityId'
										labelId="cityId"
										onChange={formik.handleChange}
										displayEmpty
										value={formik.values.cityId || ''}
										label="City"
										onBlur={formik.handleBlur}
										required
									>
										{
											cities.map((city) => (
												<MenuItem value={city.id}>
													{`${city.name}`}
												</MenuItem>
											))
										}
									</Select>
									<FormHelperText> {formik.touched.cityId && formik.errors.cityId} </FormHelperText>
								</FormControl>
							</div>

							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<label>Choose the date:</label>
								</div>

								<TextField
									id="orderDate"
									name='orderDate'
									type='date'
									InputProps={{inputProps: {min: format(new Date(), 'yyyy-MM-dd')}}}
									variant="outlined"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.orderDate}
									onChange={formik.handleChange}
									required
								/>
							</div>

							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<label>Choose the time:</label>
								</div>

								<FormControl
									fullWidth
									error={formik.touched.orderTime && Boolean(formik.errors.orderTime)}
								>
									<InputLabel id="orderTime">Time</InputLabel>
									<Select
										id='orderTime'
										name='orderTime'
										labelId="orderTime"
										onChange={formik.handleChange}
										value={formik.values.orderTime}
										label="Time"
										onBlur={formik.handleBlur}
										required
									>
										{
											OPENING_HOURS.map((elem) => (
												<MenuItem value={elem}>
													{`${elem}`}
												</MenuItem>
											))
										}
									</Select>
									<FormHelperText> {formik.touched.orderTime && formik.errors.orderTime} </FormHelperText>
								</FormControl>
							</div>

							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<label>Available masters:</label>
								</div>

								<FormControl
									fullWidth
									error={formik.touched.masterId && Boolean(formik.errors.masterId)}
								>
									<InputLabel id="masterId">Choose the master</InputLabel>
									<Select
										id='masterId'
										name='masterId'
										labelId="masterId"
										onChange={formik.handleChange}
										value={formik.values.masterId}
										label="Choose the master"
										onBlur={formik.handleBlur}
										required
									>
										{
											masters.map((master) => (
												<MenuItem value={master.id}>
													{`${master.name} | Rating:${master.rating.toFixed(2)}`}
												</MenuItem>
											))
										}
									</Select>
									<FormHelperText> {formik.touched.masterId && formik.errors.masterId} </FormHelperText>
								</FormControl>
							</div>
							<div className={classes.form_section}>
								<Button
									variant="contained"
									type="submit"
									className={classes.form_btn}
									style={ {fontSize: 18, backgroundColor: 'green', borderRadius: 15} }
								>
										Create order
								</Button>
							</div>
						</Stack>

					</form>

				</div>
				{
					notify ? <AlertMessage alertType={alertType} message={message} isOpen={isOpen} notify={notify}/> : ''
				}
			</div>
		</div>
	);
};


export default OrderForm;

