/* eslint-disable max-len */
/* eslint-disable react/jsx-key */
import React, {useState, useEffect, FC} from 'react';
import axios from 'axios';
import '../order.form/order-form.css';
import {Master, City, Clock} from '../../../data/types/types';
import {today, openingHours} from '../../../data/constants/systemConstants';
import {OrderFormProps} from './componentConstants';
import {URL} from '../../../data/constants/routeConstants';
import PublicHeader from 'src/components/Headers/PublicHeader';

const OrderForm: FC<OrderFormProps> = () => {
	const [userName, setUserName] = useState<string>('');

	const [userEmail, setUserEmail] = useState<string>('');

	const [orderDate, setOrderDate] = useState<string>('');

	const [orderTime, setOrderTime] = useState<string>(`${openingHours[0]}`);

	const [masterId, setMasterId] = useState<string>('');
	const [masters, setMasters] = useState<Master[]>([]);

	const [cityId, setCityId] = useState<number>(0);
	const [cities, setCities] = useState<City[]>([]);

	const [clockId, setClockId] = useState<number>(0);
	const [clocks, setClocks] = useState<Clock[]>([]);


	useEffect(() => {
		const readCitiesData = async () => {
			const {data} = await axios.get<City[]>(`/${URL.CITY_FOR_ORDER}`);

			if (data.length) {
				setCities(data);
				setCityId(data[0].id);
			}
		};

		readCitiesData();
	}, []);


	useEffect(() => {
		const readClocksData = async () => {
			const {data} = await axios.get<Clock[]>(`/${URL.CLOCK}`);

			if (data.length) {
				setClockId(data[0].id);
				setClocks(data);
			}
		};

		readClocksData();
	}, []);


	useEffect(() => {
		const readAvailableMastersData = async () => {
			if (clocks.length) {
				const {installationTime} = clocks.filter((clock) => clock.id === clockId)[0];
				const endDate = new Date(`${orderDate} ${orderTime}`);
				const startDate = new Date(`${orderDate} ${orderTime}`);
				startDate.setUTCHours(startDate.getHours());
				endDate.setUTCHours(endDate.getHours() + installationTime);

				if (cityId && orderDate && orderTime && clockId) {
					const {data} = await axios.get<Master[]>(`/${URL.AVAILABLE_MASTER}`, {
						params: {
							cityId,
							startWorkOn: startDate.toISOString(),
							endWorkOn: endDate.toISOString(),
						},
					});

					if (!data.length) {
						alert('All masters has been booked at that time. Please choose another time or date');
						setOrderTime('');
						setMasterId('');
						setMasters([]);
					} else {
						setMasterId(data[0].id);
						setMasters(data);
					}
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

			axios.post(`/${URL.ORDER}`,
				{
					name: userName,
					email: userEmail,
					clockId,
					cityId,
					masterId,
					startWorkOn: startDate.toISOString(),
					endWorkOn: endDate.toISOString(),
				});

			setUserName('');
			setUserEmail('');
			setOrderTime('');
			setOrderDate('');
			alert('Your order has been created! Please confirm it on your Emailbox. Have a good day!');
		}
	};

	return (
		<div>
			<PublicHeader/>
			<div className='conteiner'>

				<div className='container-form'>

					<form className='form' onSubmit={onSubmit} name='orderForm'>

						<div>

							<div className='form-section'>
								<div className='form-input__label'>
									<label>Enter your name:</label>
								</div>

								<input
									type='text'
									placeholder='Ivan Ivanov'
									pattern='^([(A-Za-zА-Яа-я]{3,49})$|^([A-Za-zА-Яа-я]{3,49}[\s]{1}[A-Za-zА-Яа-я]{3,50})$'
									title='User name must be at least 3 letter and alphabetical characters only'
									value={userName}
									onChange={(userNameEvent) => setUserName(userNameEvent.target.value)}
									required
								></input>
							</div>

							<div className='form-section'>
								<div className='form-input__label'>
									<label>Enter your email:</label>
								</div>

								<input
									type='email'
									placeholder='example@mail.com'
									pattern='^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
									title='Email must be according the example: myemail@mail.com'
									value={userEmail}
									onChange={(userEmailEvent) => setUserEmail(userEmailEvent.target.value)}
									required
								></input>
							</div>

							<div className='form-section'>
								<div className='form-input__label'>
									<label>Choose clocksize:</label>
								</div>

								<select name='clocksize' onChange={(clockIdEvent) => setClockId(Number(clockIdEvent.target.value))}>
									{
										clocks.map((clock) => (
											<option value={clock.id}>
												{`${clock.size}`}
											</option>
										))
									}
								</select>
							</div>

							<div className='form-section'>
								<div className='form-input__label'>
									<label>Choose your city:</label>
								</div>

								<select name='cities' onChange={(cityIdEvent) => setCityId(Number(cityIdEvent.target.value))}>
									{
										cities.map((city) => (
											<option value={city.id}>
												{`${city.name}`}
											</option>
										))
									}
								</select>
							</div>

							<div className='form-section'>
								<div className='form-input__label'>
									<label>Choose the date:</label>
								</div>

								<input
									type='date'
									name='orderDate'
									min= {today}
									value={orderDate}
									onChange={(orderDateEvent) => setOrderDate(orderDateEvent.target.value)}
								></input>
							</div>

							<div className='form-section'>
								<div className='form-input__label'>
									<label>Choose the time:</label>
								</div>

								<select name='orderTime' onChange={(orderTimeEvent) => setOrderTime(orderTimeEvent.target.value)}>
									{
										openingHours.map((elem) => (
											<option value={elem}>
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
											<option value={master.id}>
												{`${master.name} | Rating:${master.rating.toFixed(2)}`}
											</option>
										))
									}
									<option value="" disabled selected hidden>Choose the master</option>
								</select>
							</div>

							<div className='form-button'>
								<button type="submit"> Create order </button>
							</div>

						</div>

					</form>

				</div>

			</div>
		</div>
	);
};


export default OrderForm;

