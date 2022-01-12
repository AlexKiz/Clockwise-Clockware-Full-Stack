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
	Typography,
	Fab,
	Modal,
	Box,
	ImageList,
	ImageListItem,
} from '@mui/material';
import AlertMessage from '../../../Notification/AlertMessage';
import PrivateHeader from '../../../Headers/PrivateHeader';
import jwtDecode from 'jwt-decode';
import {ACCESS_TOKEN} from 'src/data/constants/systemConstants';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';


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

	const [modalOptions, setModalOptions] = useState<{modalImg: string, isModalOpen: boolean}>({modalImg: '', isModalOpen: false});

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

	const handleOpenModalImg = (img: string) => setModalOptions({
		modalImg: img,
		isModalOpen: true,
	});
	const handleCloseModalImg = () => setModalOptions({
		modalImg: '',
		isModalOpen: false,
	});


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
			<PrivateHeader/>
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
										<Fab
											size="small"
											component="span"
											aria-label="add"
											variant="extended"
											sx={{width: '90%'}}
											disabled={order.images ? false : true}
											onClick={() => {
												handleOpenModalImg(order.images);
											}}
										>
											<ImageOutlinedIcon />
										</Fab>
									</StyledTableCell>

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
				<Modal
					open={modalOptions.isModalOpen}
					onClose={handleCloseModalImg}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={{top: '50%',
						position: 'absolute',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 500,
						bgcolor: 'background.paper',
						border: '2px solid #000',
						boxShadow: 24,
						p: 4}}
					>
						<ImageList sx={{width: 500, height: 450, top: '50%', right: '50%'}} cols={3} rowHeight={164}>
							{modalOptions.modalImg.split(',').map((item) => (
								<ImageListItem key={item}>
									<img
										src={`${item}`}
										loading="lazy"
									/>
								</ImageListItem>
							))}
						</ImageList>
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

export default MasterOrdersList;
