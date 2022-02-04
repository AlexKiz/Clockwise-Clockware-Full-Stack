import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {CalendarProps} from './componentConstants';
import classes from './calendar.module.css';
import PrivateHeader from 'src/components/Headers/PrivateHeader';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {Paper} from '@mui/material';
import {URL} from 'src/data/constants/routeConstants';
import {OrderForCalendar} from 'src/data/types/types';

const resourceCalendar = [{
	id: 'abc1',
	title: 'Event 1',
	start: '2022-04-02T14:00:00',
	end: '2022-04-02T16:00:00',
}, {
	id: 'abc2',
	title: 'Event 2',
	start: '2022-04-03T14:00:00',
	end: '2022-04-03T16:00:00',
}, {
	id: 'adc3',
	title: 'Event 3',
	start: '2022-04-04T14:00:00',
	end: '2022-04-04T16:00:00',
}, {
	id: 'abc4',
	title: 'Event 4',
	start: '2022-04-04T16:00:00.000Z',
	end: '2022-04-04T18:00:00.000Z',
}];

const Calendar: FC<CalendarProps> = () => {
	const [orders, setOrders] = useState<OrderForCalendar[]>([]);

	useEffect(() => {
		const getOrdersForCalendar = async () => {
			const {data} = await axios.get(URL.ORDERS_FOR_CALENDAR);

			setOrders(data);
		};

		getOrdersForCalendar();
	}, []);


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
						eventColor={'red'}
					/>
				</Paper>
			</div>
		</div>
	);
};


export default Calendar;
