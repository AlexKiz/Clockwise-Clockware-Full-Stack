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
	Dialog,
	DialogTitle,
	Stack,
	Divider,
	Chip,
	IconButton,
} from '@mui/material';
import AlertMessage from '../../../Notification/AlertMessage';
import PrivateHeader from '../../../Headers/PrivateHeader';
import jwtDecode from 'jwt-decode';
import {ACCESS_TOKEN} from 'src/data/constants/systemConstants';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


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
	const [orderInfoOption, setOrderInfoOption] = useState<{
		name: string,
		price: number,
		date:string,
		isInfoOpen: boolean,
		orderAddress: string | null,
	}>({name: '', price: 0, date: '', isInfoOpen: false, orderAddress: null});

	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	const completeOrder = async (order: Order) => {
		if (window.confirm(`Do you want to complete order #${order.id.slice(0, 4)}?`)) {
			await axios.put(URL.COMPLETE_ORDER, {
				id: order.id,
				clientEmail: order.user.email,
				ratingIdentificator: order.ratingIdentificator,
				clockSize: order.clock.size,
				masterName: order.master.name,
				masterId: order.master.id,
				startWorkOn: order.startWorkOn,
				endWorkOn: order.endWorkOn,
				price: order.clock.price,
				clientName: order.user.name,
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

	const showOrderInfo = (name: string, price: number, date: string, orderAddress: string | null) => setOrderInfoOption({
		name, price, date, isInfoOpen: true, orderAddress,
	});

	const hideOrderInfo = () => setOrderInfoOption({
		name: '',
		price: 0,
		date: '',
		isInfoOpen: false,
		orderAddress: null,
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
				<TableContainer component={Paper} sx={{width: '100%'}} className={classes.conteiner_table}>
					<Table sx={{minWidth: 650}} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell sx={{width: '12%'}} align="center">Client name</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">Clock size</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">City</StyledTableCell>
								<StyledTableCell sx={{width: '8%'}} align="center">Start on</StyledTableCell>
								<StyledTableCell sx={{width: '8%'}} align="center">Finish on</StyledTableCell>
								<StyledTableCell sx={{width: '8%'}} align="center">Total price</StyledTableCell>
								<StyledTableCell sx={{width: '8%'}} align="center">Photos</StyledTableCell>
								<StyledTableCell sx={{width: '8%'}} align="center">Order Info</StyledTableCell>
								<StyledTableCell sx={{width: '14%'}} align="center"></StyledTableCell>
								<StyledTableCell sx={{width: '14%'}} align="center"></StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders.map((order) => (
								<StyledTableRow data-testid='master-orders-list-row' key={order.id}>
									<StyledTableCell component="th" scope="row" align="center"> {order.user.name} </StyledTableCell>
									<StyledTableCell align="center"> {order.clock.size} </StyledTableCell>
									<StyledTableCell align="center"> {order.city.name} </StyledTableCell>
									<StyledTableCell align="center"> {order.startWorkOn.split('T').join(' ').slice(0, 19)}</StyledTableCell>
									<StyledTableCell align="center"> {order.endWorkOn.split('T').join(' ').slice(0, 19)}</StyledTableCell>
									<StyledTableCell align="center"> {`${order.clock.price * 10} $`} </StyledTableCell>
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
											data-testid='master-order-modal-images-button'
										>
											<ImageOutlinedIcon />
										</Fab>
									</StyledTableCell>
									<StyledTableCell align="center">
										<Button
											variant='contained'
											sx={{width: '45%', borderRadius: 15}}
											onClick={() =>
												showOrderInfo(order.user.name, order.clock.price, order.paymentDate, order.orderAddress)
											}
											data-testid='master-order-modal-info-button'
										>
											<InfoOutlinedIcon/>
										</Button>
									</StyledTableCell>
									<StyledTableCell align="center">
										<Button
											disabled={order.isCompleted}
											variant="contained"
											color='success'
											sx={{width: '100%', fontSize: 14, borderRadius: 15}}
											onClick={() => completeOrder(order)}
											data-testid='master-order-complete-button'
										>
											{order.isCompleted ? 'Done!' : 'Complete Order'}
										</Button>
									</StyledTableCell>
									<StyledTableCell align="center">
										<Button
											disabled={!order.isCompleted}
											variant="contained"
											color='error'
											sx={{width: '100%', fontSize: 14, borderRadius: 15}}
											onClick={() => {
												window.open(
													`${process.env.REACT_APP_API_URL}/downloadOrderReceipt?clockSize=${order.clock.size}
													&masterName=${order.master.name}&masterId=${order.master.id}
													&startWorkOn=${order.startWorkOn}&endWorkOn=${order.endWorkOn}
													&price=${order.clock.price}&clientName=${order.user.name}
													&clientEmail=${order.user.email}`,
													'_blank',
												);
											}}
										>
											Download Receipt
										</Button>
									</StyledTableCell>
								</StyledTableRow>
							))}
							{ !orders.length &&
								<TableRow>
									<TableCell
										colSpan={10}
										sx={{height: 365, p: 0}}
										align='center'>
										<Typography
											variant='h3'
											component='label'
											data-testid='no-orders-label'
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
					<Box sx={{
						top: '50%',
						position: 'absolute',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 800,
						bgcolor: 'background.paper',
						border: '2px solid #000',
						boxShadow: 24,
						padding: '50px',
					}}
					data-testid='master-order-modal-images'
					>
						<div style={{position: 'relative', width: '100%'}}>
							<HighlightOffIcon
								fontSize='large'
								sx={{
									position: 'absolute',
									right: '-6%',
									top: '-9%',
									color: 'red',
									height: '50px',
									width: '50px',
									cursor: 'pointer',
								}}
								onClick={handleCloseModalImg}
							/>
							<ImageList sx={{maxWidth: 1000, maxHeight: 700, top: '50%', right: '50%'}} cols={1}>
								{modalOptions.modalImg.split(',').map((item, index) => (
									<ImageListItem key={item}>
										<div>
											<Divider sx={{m: '40px 0px'}}>
												<Chip
													sx={{fontSize: '16px', lineHeight: 1}}
													label={`Photo #${index + 1}`}
													variant="outlined"
													color="info"
													icon={<ImageOutlinedIcon />}
												/>
											</Divider>
										</div>
										<img
											style={{objectFit: 'contain'}}
											src={`${item}`}
											loading="lazy"
										/>
									</ImageListItem>
								))}
							</ImageList>
						</div>
					</Box>
				</Modal>
				<Dialog
					open={orderInfoOption.isInfoOpen}
					onClose={hideOrderInfo}
					data-testid='master-order-modal-info'
				>
					<Stack
						direction="column"
						justifyContent="center"
						spacing={1}
						sx={{p: 5, width: '300px'}}
					>
						<DialogTitle>
							Order Info
							<IconButton
								aria-label="close"
								onClick={hideOrderInfo}
								sx={{
									position: 'absolute',
									right: 8,
									top: 8,
									color: 'red',
								}}
							>
								<HighlightOffIcon fontSize='large'/>
							</IconButton>
						</DialogTitle>
						<Typography
							variant="subtitle1"
							gutterBottom
							component="div"
						>
							<b>User name: {orderInfoOption.name}</b>
						</Typography>
						<Typography
							variant="subtitle1"
							gutterBottom
							component="div"
						>
							<b>Price paid: {orderInfoOption.price * 10}$</b>
						</Typography>
						<Typography
							variant="subtitle1"
							gutterBottom
							component="div"
						>
							<b>Payment date: {orderInfoOption.date.split('T')[0]}</b>
						</Typography>
						<Typography
							variant="subtitle1"
							gutterBottom
							component="div"
						>
							<b>Payment time: {orderInfoOption.date.split('T')[1]?.slice(0, 5)}</b>
						</Typography>
						{orderInfoOption.orderAddress && <Typography
							variant="subtitle1"
							gutterBottom
							component="div"
						>
							<b>Address: {orderInfoOption.orderAddress}</b>
						</Typography>}
					</Stack>
				</Dialog>
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
