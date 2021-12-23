/* eslint-disable max-len */
/* eslint-disable react/jsx-key */
import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import classes from './master-orders-list.module.css';
import {Order} from '../../../../data/types/types';
import {MasterOrdersListProps} from './componentConstants';
import {URL} from '../../../../data/constants/routeConstants';
import {styled} from '@mui/material/styles';
import {Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Paper,
	tableCellClasses} from '@mui/material';
import AlertMessage from '../../../Notification/AlertMessage';
import MasterHeader from '../../../Headers/MasterHeader';

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

	const [notify, setNotify] = useState<boolean>(false);

	const isOpen = (value:boolean) => {
		setNotify(value);
	};

	const completeOrder = async (order: Order) => {
		await axios.put(URL.ORDER, {
			id: order.id,
			clientEmail: order.user.email,
			ratingIdentificator: order.ratingIdentificator,
		});
		setNotify(true);
	};


	useEffect(() => {
		const readOrdersData = async () => {
			const {data} = await axios.get<Order[]>(URL.ORDER);

			setOrders(data);
		};

		readOrdersData();
	}, []);


	return (
		<div>
			<MasterHeader/>
			<div className={classes.conteiner}>

				<TableContainer component={Paper} sx={{width: 4/5}} className={classes.conteiner_table}>

					<Table sx={{minWidth: 650}} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell sx={{width: 1/13}} align="center">Client name</StyledTableCell>
								<StyledTableCell sx={{width: 1/9}} align="center">Clock size</StyledTableCell>
								<StyledTableCell sx={{width: 3/17}} align="center">City</StyledTableCell>
								<StyledTableCell sx={{width: 1/10}} align="center">Start on</StyledTableCell>
								<StyledTableCell sx={{width: 1/10}} align="center">Finish on</StyledTableCell>
								<StyledTableCell sx={{width: 1/10}} align="center">Total price</StyledTableCell>
								<StyledTableCell sx={{width: 2/10}} align="center"></StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders.map((order) => (
								<StyledTableRow>

									<StyledTableCell component="th" scope="row"> {order.user.name} </StyledTableCell>
									<StyledTableCell align="center"> {order.clock.size} </StyledTableCell>
									<StyledTableCell align="center"> {order.city.name} </StyledTableCell>
									<StyledTableCell align="center"> {order.startWorkOn.split('T').join(' ')} </StyledTableCell>
									<StyledTableCell align="center"> {order.endWorkOn.split('T').join(' ')} </StyledTableCell>
									<StyledTableCell align="center"> {order.clock.price} </StyledTableCell>

									<StyledTableCell align="center">
										<Button
											variant="contained"
											sx={{width: 1/1, fontSize: 14, borderRadius: 15}}
											onClick={() => completeOrder(order)}
										>
											Update
										</Button>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>

				</TableContainer>
				{
					notify ? <AlertMessage alertType='success' message='Order has been completed' isOpen={isOpen} notify={notify}/> : ''
				}
			</div>
		</div>
	);
};

export default MasterOrdersList;
