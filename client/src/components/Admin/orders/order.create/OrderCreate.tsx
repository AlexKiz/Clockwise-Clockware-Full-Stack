/* eslint-disable react/jsx-key */
import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import classes from '../order.create/order-create-form.module.css';
import {Params, User, Clock, City, Master} from '../../../../data/types/types';
import {OPENING_HOURS} from '../../../../data/constants/systemConstants';
import {OrderCreateProps, validate} from './componentConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';
import {format} from 'date-fns';
import {getOrderDates} from 'src/data/utilities/systemUtilities';
import {useFormik} from 'formik';
import {Button,
	Stack,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	FormHelperText,
	AlertColor} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';


const OrderCreate: FC<OrderCreateProps> = () => {
	const history = useHistory();

	const {orderIdParam, userIdParam, clockIdParam, cityIdParam, orderDateParam, orderTimeParam, masterIdParam} = useParams<Params>();

	const [users, setUsers] = useState<User[]>([]);
	const [clocks, setClocks] = useState<Clock[]>([]);
	const [cities, setCities] = useState<City[]>([]);
	const [masters, setMasters] = useState<Master[]>([]);

	const [notify, setNotify] = useState<boolean>(false);
	const [alertType, setAlertType] = useState<AlertColor>('success');
	const [message, setMessage] = useState<string>('');

	const isOpen = (value:boolean) => {
		setNotify(value);
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
					setMessage('Order has been updated');
					setAlertType('success');
					setNotify(true);
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
					setMessage('All masters has been booked at that time. Please choose another time or date');
					setAlertType('warning');
					setNotify(true);
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
									<label>Choose user:</label>
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
									<label>Choose clock size:</label>
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
									<label>Choose city:</label>
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
									<label>Choose date:</label>
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
									<label>Choose order time:</label>
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
									Submit
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

export default OrderCreate;
