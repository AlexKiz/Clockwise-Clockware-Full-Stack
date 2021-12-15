/* eslint-disable react/jsx-key */
import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import '../order.create/order-create-form.css';
import {Params, User, Clock, City, Master} from '../../../../data/types/types';
import {openingHours} from '../../../../data/constants/systemConstants';
import {OrderCreateProps} from './componentConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';
import {format} from 'date-fns';


const OrderCreate: FC<OrderCreateProps> = () => {
	const history = useHistory();

	const {orderIdParam, userIdParam, clockIdParam, cityIdParam, orderDateParam, orderTimeParam, masterIdParam} = useParams<Params>();

	const [userId, setUserId] = useState<string>('');
	const [users, setUsers] = useState<User[]>([]);

	const [clockId, setClockId] = useState<number>(0);
	const [clocks, setClocks] = useState<Clock[]>([]);

	const [cityId, setCityId] = useState<number>(0);
	const [cities, setCities] = useState<City[]>([]);

	const [orderDate, setOrderDate] = useState<string>(orderDateParam);
	const [orderTime, setOrderTime] = useState<string>(orderTimeParam);

	const [masterId, setMasterId] = useState<string>('');
	const [masters, setMasters] = useState<Master[]>([]);


	useEffect(() => {
		const readUsersData = async () => {
			const {data} = await axios.get<User[]>(URL.USER);

			setUsers(data);
			setUserId(userIdParam);
		};

		readUsersData();
	}, []);


	useEffect(() => {
		const readClocksData = async () => {
			const {data} = await axios.get<Clock[]>(URL.CLOCK);

			setClocks(data);
			setClockId(Number(clockIdParam));
		};

		readClocksData();
	}, []);


	useEffect(() => {
		const readCitiesData = async () => {
			const {data} = await axios.get<City[]>(URL.CITY);

			setCities(data);
			setCityId(Number(cityIdParam));
		};

		readCitiesData();
	}, []);


	useEffect(() => {
		const readAvailableMastersData = async () => {
			if (clocks.length) {
				const {installationTime} = clocks.filter((clock) => clock.id === clockId)[0];
				const endDate = new Date(`${orderDate} ${orderTime}`);
				const startDate = new Date(`${orderDate} ${orderTime}`);
				startDate.setUTCHours(startDate.getHours());
				endDate.setUTCHours(endDate.getHours() + installationTime);

				const {data} = await axios.get<Master[]>(URL.AVAILABLE_MASTER, {
					params: {
						currentOrderId: orderIdParam,
						cityId: cityIdParam,
						startWorkOn: startDate.toISOString(),
						endWorkOn: endDate.toISOString(),
					},
				});

				if (!data.length) {
					alert('All masters has been booked at that time. Please choose another time or date');
					setOrderTime('');
				} else {
					setMasterId(masterIdParam);
					setMasters(data);
				}
			};
		};
		readAvailableMastersData();
	}, [cityId, clockId, orderDate, orderTime]);


	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (clocks.length) {
			const {installationTime} = clocks.filter((clock) => clock.id === clockId)[0];
			const endDate = new Date(`${orderDate} ${orderTime}`);
			const startDate = new Date(`${orderDate} ${orderTime}`);
			startDate.setUTCHours(startDate.getHours());
			endDate.setUTCHours(endDate.getHours() + installationTime);

			axios.put(URL.ORDER,
				{
					id: orderIdParam,
					clockId,
					userId,
					cityId,
					masterId,
					startWorkOn: startDate.toISOString(),
					endWorkOn: endDate.toISOString(),
				}).then(() => {
				alert('Order has been updated');
				history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`);
			});
		}
	};


	return (
		<div className='container-form'>

			<form className='form' onSubmit={onSubmit}>

				<div>

					<div className='form-section'>
						<div className='form-input__label'>
							<label>
                                Choose user:
							</label>
						</div>

						<select name='users' onChange={(userIdEvent) => setUserId(userIdEvent.target.value)}>
							{
								users.map((user) => (
									<option selected = {user.id === userIdParam} value={user.id}>
										{` user: ${user.name} | email: ${user.email}`}
									</option>
								))
							}
						</select>
					</div>


					<div className='form-section'>
						<div className='form-input__label'>
							<label>
                                Choose clock size:
							</label>
						</div>

						<select name='clocks' onChange={(clockIdEvent) => setClockId(Number(clockIdEvent.target.value))}>
							{
								clocks.map((clock) => (
									<option selected = {clock.id === Number(clockIdParam)} value={clock.id}>
										{`${clock.size}`}
									</option>
								))
							}
						</select>
					</div>


					<div className='form-section'>
						<div className='form-input__label'>
							<label>
                                Choose city:
							</label>
						</div>

						<select name='cities' onChange={(cityIdEvent) => setCityId(Number(cityIdEvent.target.value))}>
							{
								cities.map((city) => (
									<option selected = {city.id === Number(cityIdParam)} value={city.id}>
										{`${city.name}`}
									</option>
								))
							}
						</select>
					</div>


					<div className='form-section'>
						<div className='form-input__label'>
							<label>
                                Choose date:
							</label>
						</div>
						<input
							type='date'
							name='orderDate'
							min= {format(new Date(), 'yyyy-MM-dd')}
							value={orderDate}
							onChange={(orderDateEvent) => setOrderDate(orderDateEvent.target.value)}
						></input>
					</div>


					<div className='form-section'>
						<div className='form-input__label'>
							<label>
                                Choose order time:
							</label>
						</div>

						<select name='orderTime' onChange={(orderTimeEvent) => setOrderTime(orderTimeEvent.target.value)}>
							{
								openingHours.map((elem) => (
									<option selected = {elem === orderTime} value={elem}>
										{`${elem}`}
									</option>
								))
							}
						</select>
					</div>


					<div className='form-section'>
						<div className='form-input__label'>
							<label>Available masters:</label>
						</div>

						<select name='masterName' onChange={(masterIdEvent) => setMasterId(masterIdEvent.target.value)}>
							{
								masters.map((master) => (
									<option selected = {master.id === masterIdParam} value={master.id}>
										{`${master.name}`}
									</option>
								))
							}
						</select>
					</div>


					<div className='form-button'>
						<button type="submit"> Confirm </button>
					</div>

				</div>
			</form>
		</div>
	);
};

export default OrderCreate;
