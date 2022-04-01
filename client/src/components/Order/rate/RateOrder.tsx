import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {useHistory, useParams} from 'react-router-dom';
// @ts-ignore
import ReactStars from 'react-rating-stars-component';
import classes from './rate-order.module.css';
import {Params, Order, AlertNotification} from '../../../data/types/types';
import {RateOrderProps} from './componentConstants';
import {URL} from '../../../data/constants/routeConstants';
import {Button, Stack, Typography} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';

const RateOrder: FC<RateOrderProps> = () => {
	const history = useHistory();

	const {ratingIdentificatorParam} = useParams<Params>();

	const [rating, setRating] = useState<number>(0);

	const [order, setOrder] = useState<Order | null>(null);

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

			if (data) {
				setOrder(data);
			} else {
				setAlertOptions({
					message: 'Current order has been already rated',
					type: 'warning',
					notify: true,
				});
				history.push(URL.LOGIN);
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
			id: order?.id,
			orderRated: rating,
			masterId: order?.master.id,
		}).then(() => {
			setAlertOptions({
				message: 'Thanks for your feedback',
				type: 'success',
				notify: true,
			});
			history.push(URL.LOGIN);
		});
	};

	return (
		<div>
			<div className={classes.container}>
				<div className={classes.container_form}>
					<form className={classes.form} onSubmit={onSubmit} name='orderForm'>

						<div>
							{ order &&
								<Stack direction="column" justifyContent="center" spacing={1.5}>
									<div className={classes.form_master}>
										<Typography
											variant="h6"
											gutterBottom
											component="label"
										>
											Please, rate the following master:
										</Typography>
										<Typography
											variant="subtitle1"
											gutterBottom
											component="div"
										>
											{order.master.name}
										</Typography>
									</div>

									<div className={classes.form_orderinfo}>
										<Stack direction="column" justifyContent="center" spacing={1.5}>
											<Typography
												variant="subtitle1"
												gutterBottom
												component="div"
												align='center'
											>
												<b>Order #{order.id.slice(0, 4)}</b>
											</Typography>
											<Typography
												variant="subtitle1"
												gutterBottom
												component="div"
											>
												<b> User name:</b> {order.user.name}
											</Typography>
											<Typography
												variant="subtitle1"
												gutterBottom
												component="div"
											>
												<b> User email:</b> {order.user.email}
											</Typography>
											<Typography
												variant="subtitle1"
												gutterBottom
												component="div"
											>
												<b> Clock size:</b>  <span>{order.clock.size}</span>
											</Typography>
											<Typography
												variant="subtitle1"
												gutterBottom
												component="div"
											>
												<b> City:</b>  <span>{order.city.name}</span>
											</Typography>
											<Typography
												variant="subtitle1"
												gutterBottom
												component="div"
											>
												<b> Start work on:</b>  <span>{order.startWorkOn.split('T').join(' ')}</span>
											</Typography>
											<Typography
												variant="subtitle1"
												gutterBottom
												component="div"
											>
												<b> End work on:</b>  <span>{order.endWorkOn.split('T').join(' ')} </span>
											</Typography>
										</Stack>
									</div>
								</Stack>
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
									data-testid='order-rate-submit'
								>
										Rate order
								</Button>
							</div>

						</div>
					</form>
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

		</div>
	);
};

export default RateOrder;
