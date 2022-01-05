/* eslint-disable max-len */
/* eslint-disable no-mixed-spaces-and-tabs */
import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {useHistory, useParams} from 'react-router-dom';
// @ts-ignore
import ReactStars from 'react-rating-stars-component';
import classes from './rate-order.module.css';
import {Params, Order, AlertNotification} from '../../../data/types/types';
import {RateOrderProps} from './componentConstants';
import {URL} from '../../../data/constants/routeConstants';
import {Button} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';

const RateOrder: FC<RateOrderProps> = () => {
	const history = useHistory();

	const {ratingIdentificatorParam} = useParams<Params>();

	const [rating, setRating] = useState<number>(0);

	const [order, setOrder] = useState<Order>({} as Order);

	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});


	useEffect(() => {
		const readOrderForRate = async () => {
			const {data} = await axios.get<Order>(URL.ORDER_FOR_RATE, {

				params: {
					ratingIdentificator: ratingIdentificatorParam,
				},
			});

			if (!data) {
				setOrder(data);
			} else {
				alert('Current order has been already rated');
				history.push('/');
			}
		};
		readOrderForRate();
	}, []);

	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		axios.put(URL.RATED_ORDER, {
			id: order.id,
			orderRated: rating,
			masterId: order.master.id,
		}).then(() => {
			setAlertOptions({
				message: 'Thanks for your feedback',
				type: 'success',
				notify: true,
			});
			history.push('/');
		});
	};

	return (
		<div>
			<div className={classes.container}>
				<div className={classes.container_form}>
					<form className={classes.form} onSubmit={onSubmit} name='orderForm'>

						<div>
							{ order &&
                            <>
                            	<div className={classes.form_master}>
                            		<label>Please, rate the following master:</label>
                            		<p>{order.master.name}</p>
                            	</div>
                            	<div className={classes.form_orderinfo}>
                            		<b>Order #{order.id}</b>
                            		<br/>
                            		<b> User name:</b> <span>{order.user.name}</span>
                            		<br/>
                            		<b> User email:</b> <span>{order.user.email}</span>
                            		<br/>
                            		<b> Clock size:</b>  <span>{order.clock.size}</span>
                            		<br/>
                            		<b> City:</b>  <span>{order.city.name}</span>
                            		<br/>
                            		<b> Start work on:</b>  <span>{order.startWorkOn.split('T').join(' ')}</span>
                            		<br/>
                            		<b> End work on:</b>  <span>{order.endWorkOn.split('T').join(' ')} </span>
                            	</div>
                            </>
							}

							<div className={classes.form_stars}>
								<ReactStars
									count={5}
									size={75}
									activeColor="#f6ff00"
									isHalf={true}
									value={rating}
									onChange={(newRating: number) => setRating(newRating)}
								/>
							</div>

							<div className={classes.form_button}>
								<Button
									variant="contained"
									type="submit"
									className={classes.form_btn}
									style={ {fontSize: 18, backgroundColor: 'green', borderRadius: 15} }
								>
										Create order
								</Button>
							</div>

						</div>
					</form>
					{
						alertOptions.notify && <AlertMessage alertType={alertOptions.type} message={alertOptions.message} isOpen={isOpen} notify={alertOptions.notify}/>
					}
				</div>
			</div>

		</div>
	);
};

export default RateOrder;
