import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import classes from './master-orders-list.module.css';
import {Order, AlertNotification} from '../../../../data/types/types';
import {MasterOrdersListProps} from './componentConstants';
import {URL} from '../../../../data/constants/routeConstants';
import {styled} from '@mui/material/styles';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Paper,
	tableCellClasses,
} from '@mui/material';
import AlertMessage from '../../../Notification/AlertMessage';
import MasterHeader from '../../../Headers/PrivateHeader';
import jwtDecode from 'jwt-decode';
import {ACCESS_TOKEN} from 'src/data/constants/systemConstants';


const StyledTableCell = styled(TableCell)(({theme}) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.warning.main,
		color: theme.palette.common.black,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

const MasterOrdersList: FC<MasterOrdersListProps> = () => {
	const [orders, setOrders] = useState<Order[]>([]);

	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});

	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	const completeOrder = async (order: Order) => {
		if (window.confirm(`Do you want to complete order #${order.id.slice(0, 4)}?`)) {
			await axios.put(URL.COMPLETE_ORDER, {
				id: order.id,
				clientEmail: order.user.email,
				ratingIdentificator: order.ratingIdentificator,
			}).then(async () => {
				const {data} = await axios.get<Order[]>(URL.ORDER);
				setOrders(data);
			});
		}
		setAlertOptions({
			type: 'success',
			message: 'Order has been completed!',
			notify: true,
		});
	};


	useEffect(() => {
		const readOrdersData = async () => {
			const {data} = await axios.get<Order[]>(URL.ORDER);

			setOrders(data);
		};

		readOrdersData();
	}, []);


	useEffect(() => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			const {name: masterName} = jwtDecode<{name: string}>(token);
			setAlertOptions({
				notify: true,
				type: 'info',
				message: `Hello, ${masterName}!`,
			});
		}
	}, []);


	return (
		<div>
			<MasterHeader/>
			<div className={classes.conteiner}>
				<TableContainer component={Paper} sx={{width: '80%'}} className={classes.conteiner_table}>
					<Table sx={{minWidth: 650}} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell sx={{width: '16%'}} align="center">Client name</StyledTableCell>
								<StyledTableCell sx={{width: '16%'}} align="center">Clock size</StyledTableCell>
								<StyledTableCell sx={{width: '18%'}} align="center">City</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">Start on</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">Finish on</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">Total price</StyledTableCell>
								<StyledTableCell sx={{width: '20%'}} align="center"></StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders.map((order) => (
								<StyledTableRow key={order.id}>
									<StyledTableCell component="th" scope="row" align="center"> {order.user.name} </StyledTableCell>
									<StyledTableCell align="center"> {order.clock.size} </StyledTableCell>
									<StyledTableCell align="center"> {order.city.name} </StyledTableCell>
									<StyledTableCell align="center"> {order.startWorkOn.split('T').join(' ')} </StyledTableCell>
									<StyledTableCell align="center"> {order.endWorkOn.split('T').join(' ')} </StyledTableCell>
									<StyledTableCell align="center"> {order.clock.price} </StyledTableCell>
									<StyledTableCell align="center">
										<Button
											disabled={order.isCompleted}
											variant="contained"
											sx={{width: '100%', fontSize: 14, borderRadius: 15}}
											onClick={() => completeOrder(order)}
										>
											{order.isCompleted ? 'Done!' : 'Complete Order'}
										</Button>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
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

export default MasterOrdersList;
