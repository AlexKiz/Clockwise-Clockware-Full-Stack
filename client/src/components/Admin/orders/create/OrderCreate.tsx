/* eslint-disable max-len */
/* eslint-disable react/jsx-key */
import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import classes from './order-create-form.module.css';
import {Params, User, Clock, City, Master, AlertNotification} from '../../../../data/types/types';
import {OPENING_HOURS} from '../../../../data/constants/systemConstants';
import {OrderCreateProps, validate} from './componentConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';
import {format} from 'date-fns';
import {getOrderDates} from 'src/data/utilities/systemUtilities';
import {useFormik} from 'formik';
import {
	Button,
	Stack,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	FormHelperText,
	Typography,
} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';


const OrderCreate: FC<OrderCreateProps> = () => {
	const history = useHistory();

	const {orderIdParam, userIdParam, clockIdParam, cityIdParam, orderDateParam, orderTimeParam, masterIdParam} = useParams<Params>();

	const [users, setUsers] = useState<User[]>([]);
	const [clocks, setClocks] = useState<Clock[]>([]);
	const [cities, setCities] = useState<City[]>([]);
	const [masters, setMasters] = useState<Master[]>([]);

	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});


	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	const formik = useFormik({
		initialValues: {
			orderId: orderIdParam,
			userId: userIdParam,
			cityId: Number(cityIdParam),
			clockId: Number(clockIdParam),
			orderDate: orderDateParam,
			orderTime: orderTimeParam.slice(0, 5),
			masterId: masterIdParam,
		},
		validate,
		onSubmit: async (values) => {
			if (clocks.length) {
				const {installationTime} = clocks.filter((clock) => clock.id === values.clockId)[0];
				const endDate = new Date(`${values.orderDate} ${values.orderTime}`);
				const startDate = new Date(`${values.orderDate} ${values.orderTime}`);
				startDate.setUTCHours(startDate.getHours());
				endDate.setUTCHours(endDate.getHours() + installationTime);

				await axios.put(URL.ORDER,
					{
						id: values.orderId,
						clockId: values.clockId,
						userId: values.userId,
						cityId: values.cityId,
						masterId: values.masterId,
						startWorkOn: startDate.toISOString(),
						endWorkOn: endDate.toISOString(),
					}).then(() => {
					setAlertOptions({message: 'Order has been updated', type: 'success', notify: true});
					history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`);
				});
			}
		},
	});

	useEffect(() => {
		const readUsersData = async () => {
			const {data} = await axios.get<User[]>(URL.USER);

			setUsers(data);
			formik.values.orderTime = orderTimeParam.slice(0, 5);
		};

		readUsersData();
	}, []);


	useEffect(() => {
		const readClocksData = async () => {
			const {data} = await axios.get<Clock[]>(URL.CLOCK);

			setClocks(data);
		};

		readClocksData();
	}, []);


	useEffect(() => {
		const readCitiesData = async () => {
			const {data} = await axios.get<City[]>(URL.CITY);

			setCities(data);
		};

		readCitiesData();
	}, []);


	useEffect(() => {
		const readAvailableMastersData = async () => {
			if (clocks.length) {
				const [startDate, endDate] = getOrderDates(clocks, formik.values.orderDate, formik.values.orderTime, formik.values.clockId);

				const {data} = await axios.get<Master[]>(URL.AVAILABLE_MASTER, {
					params: {
						currentOrderId: orderIdParam,
						cityId: cityIdParam,
						startWorkOn: startDate,
						endWorkOn: endDate,
					},
				});

				if (!data.length) {
					setAlertOptions({
						message: 'All masters has been booked at that time. Please choose another time or date',
						type: 'warning',
						notify: true,
					});
					formik.values.orderTime = '';
				} else {
					setMasters(data);
				}
			}
		};
		readAvailableMastersData();
	}, [formik.values.cityId, formik.values.clockId, formik.values.orderDate, formik.values.orderTime, clocks]);


	return (
		<div>

			<div className={classes.conteiner}>

				<div className={classes.container_form}>

					<form className={classes.form} onSubmit={formik.handleSubmit}>

						<Stack direction="column" justifyContent="center" spacing={1.5}>

							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										Choose user:
									</Typography>
								</div>

								<FormControl
									fullWidth
									error={formik.touched.userId && Boolean(formik.errors.userId)}
								>
									<InputLabel id="userId">User</InputLabel>
									<Select
										id='userId'
										name='userId'
										labelId="userId"
										displayEmpty
										onChange={formik.handleChange}
										value={formik.values.userId}
										label="Size"
										onBlur={formik.handleBlur}
										required
									>
										{
											users.map((user) => (
												<MenuItem value={user.id}>
													{` user: ${user.name} | email: ${user.email}`}
												</MenuItem>
											))
										}
									</Select>
									<FormHelperText> {formik.touched.userId && formik.errors.userId} </FormHelperText>
								</FormControl>
							</div>


							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										Choose clock size:
									</Typography>
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
										value={formik.values.clockId}
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
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										Choose city:
									</Typography>
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
										value={formik.values.cityId}
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
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										Choose date:
									</Typography>
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
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										Choose order time:
									</Typography>
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
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										Available masters:
									</Typography>
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
									Submit
								</Button>
							</div>
						</Stack>

					</form>

				</div>
				{
					alertOptions.notify && <AlertMessage alertType={alertOptions.type} message={alertOptions.message} isOpen={isOpen} notify={alertOptions.notify}/>
				}
			</div>
		</div>
	);
};

export default OrderCreate;
