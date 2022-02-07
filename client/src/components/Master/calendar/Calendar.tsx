import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {CalendarProps} from './componentConstants';
import classes from './calendar.module.css';
import PrivateHeader from 'src/components/Headers/PrivateHeader';
import FullCalendar, {EventClickArg} from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {Box, Button, CircularProgress, Modal, Paper, Stack, Typography} from '@mui/material';
import {URL} from 'src/data/constants/routeConstants';
import {AlertNotification, OrderForCalendar} from 'src/data/types/types';
import AlertMessage from 'src/components/Notification/AlertMessage';

const resourceCalendar = [{
	id: 'abc1',
	title: 'Event 1',
	start: '2022-02-02T14:00:00',
	end: '2022-02-02T16:00:00',
	color: 'green',
}, {
	id: 'abc2',
	title: 'Event 2',
	start: '2022-02-03T14:00:00',
	end: '2022-02-03T16:00:00',
}, {
	id: 'adc3',
	title: 'Event 3',
	start: '2022-02-04T14:00:00',
	end: '2022-02-04T16:00:00',
}, {
	id: 'abc4',
	title: 'Event 4',
	start: '2022-02-04T16:00:00.000Z',
	end: '2022-02-04T18:00:00.000Z',
}];

const Calendar: FC<CalendarProps> = () => {
	const [orders, setOrders] = useState<OrderForCalendar[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [calendarEvent, setCalendarEvent] = useState<EventClickArg>();
	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const getOrdersForCalendar = async () => {
			const {data} = await axios.get<OrderForCalendar[]>(URL.ORDERS_FOR_CALENDAR);

			setOrders(data);
		};

		getOrdersForCalendar();
	}, []);

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	const handleCompleteOrder = async (id?: string, clientEmail?: string, ratingIdentificator?: string) => {
		setLoading(true);
		await axios.put(URL.COMPLETE_ORDER, {
			id,
			clientEmail,
			ratingIdentificator,
		}).then(async () => {
			const {data} = await axios.get<OrderForCalendar[]>(URL.ORDERS_FOR_CALENDAR);
			setOrders(data);
			setLoading(false);
			setIsModalOpen(false);
			setAlertOptions({
				notify: true,
				message: 'Order has been completed!',
				type: 'success',
			});
		});
	};


	return (
		<div>
			<PrivateHeader/>
			<div className={classes.conteiner}>
				<Paper sx={{width: '90%', p: 7, m: '0 auto'}} elevation={4}>
					<FullCalendar
						plugins={[dayGridPlugin, timeGridPlugin]}
						headerToolbar={{
							right: 'prev,next today',
							center: 'title',
							left: 'dayGridMonth,timeGridWeek,timeGridDay',
						}}
						events={orders}
						eventClick={(orderOptions) => {
							handleModalOpen();
							setCalendarEvent(orderOptions);
						}}
					/>
				</Paper>
				<Modal
					open={isModalOpen}
					onClose={handleModalClose}
				>
					<Box sx={{top: '50%',
						position: 'absolute',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 500,
						bgcolor: 'background.paper',
						border: '2px solid #000',
						boxShadow: 24}}
					>
						<Stack
							direction="column"
							justifyContent="center"
							alignItems='center'
							spacing={1}
							sx={{p: 5}}
						>
							<Typography
								variant="subtitle1"
								gutterBottom
								component="div"
								align='center'
							>
								<b>Clock type: {calendarEvent?.event._def.extendedProps.clockSize}</b>
							</Typography>
							<Typography
								variant="subtitle1"
								gutterBottom
								component="div"
								align='center'
							>
								<b>Client name: {calendarEvent?.event._def.extendedProps.clientName}</b>
							</Typography>
							<Typography
								variant="subtitle1"
								gutterBottom
								component="div"
								align='center'
							>
								<b>Price paid: {calendarEvent?.event._def.extendedProps.price}</b>
							</Typography>
							<Typography
								variant="subtitle1"
								gutterBottom
								component="div"
								align='center'
							>
								<b>Status: {calendarEvent?.event._def.extendedProps.isCompleted ? 'Done' : 'In progress'}</b>
							</Typography>
							<Button
								variant="contained"
								sx={{width: '60%', fontSize: 12, borderRadius: 8}}
								color='info'
								disabled={calendarEvent?.event._def.extendedProps.isCompleted || loading}
								onClick={() => handleCompleteOrder(
									calendarEvent?.event._def.publicId,
									calendarEvent?.event._def.extendedProps.clientEmail,
									calendarEvent?.event._def.extendedProps.ratingIdentificator,
								)}
							>
								{calendarEvent?.event._def.extendedProps.isCompleted ? 'Done' : 'Complete order'}
								{loading && <CircularProgress
									size={22}
									color="success"
									sx={{
										position: 'absolute',
										top: '50%',
										left: '50%',
										marginTop: '-11px',
										marginLeft: '-11px',
									}}
								/>}
							</Button>
						</Stack>
					</Box>
				</Modal>
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
	);
};


export default Calendar;
