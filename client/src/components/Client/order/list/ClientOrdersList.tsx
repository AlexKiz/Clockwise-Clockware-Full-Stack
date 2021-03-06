import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import classes from './client-orders-list.module.css';
import {Order} from '../../../../data/types/types';
import {ClientOrdersListProps} from './componentConstants';
import {URL, RESOURCE} from '../../../../data/constants/routeConstants';
import {useHistory} from 'react-router-dom';
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
	Typography,
} from '@mui/material';
import PrivateHeader from '../../../Headers/PrivateHeader';


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

const ClientOrdersList: FC<ClientOrdersListProps> = () => {
	const history = useHistory();

	const [orders, setOrders] = useState<Order[]>([]);

	const rateOrder = async (ratingIdentificator: string) => {
		history.push(`/${RESOURCE.RATE}/${ratingIdentificator}`);
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
			<PrivateHeader/>
			<div className={classes.conteiner}>
				<TableContainer component={Paper} sx={{width: '80%'}} className={classes.conteiner_table}>
					<Table sx={{minWidth: 650}} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell sx={{width: '20%'}} align="center">Master name</StyledTableCell>
								<StyledTableCell sx={{width: '20%'}} align="center">Clock size</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">Start on</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">Finish on</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">Total price</StyledTableCell>
								<StyledTableCell sx={{width: '30%'}} align="center">Rating:</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders.map((order) => (
								<StyledTableRow key={order.id}>
									<StyledTableCell
										component="th"
										scope="row"
										align='center'
									>
										{order.master.name}
									</StyledTableCell>
									<StyledTableCell align="center"> {order.clock.size} </StyledTableCell>
									<StyledTableCell align="center"> {order.startWorkOn.split('T').join(' ').slice(0, 19)}</StyledTableCell>
									<StyledTableCell align="center"> {order.endWorkOn.split('T').join(' ').slice(0, 19)}</StyledTableCell>
									<StyledTableCell align="center"> {`${order.clock.price * 10} $`} </StyledTableCell>
									<StyledTableCell align="center">
										{ order.ratingIdentificator ?
											<Button
												disabled={!order.isCompleted}
												variant="contained"
												sx={{width: '100%', fontSize: 14, borderRadius: 15}}
												onClick={() => rateOrder(order.ratingIdentificator)}
											>
                                                Rate Order
											</Button> : order.orderRating
										}
									</StyledTableCell>
								</StyledTableRow>
							))}
							{ !orders.length &&
								<TableRow>
									<TableCell
										colSpan={9}
										sx={{height: 365, p: 0}}
										align='center'>
										<Typography
											variant='h3'
											component='label'
										>
											There are no orders yet!
										</Typography>
									</TableCell>
								</TableRow>
							}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default ClientOrdersList;
