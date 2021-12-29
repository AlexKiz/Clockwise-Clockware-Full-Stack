import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './orders-list.module.css';
import {Order} from '../../../../data/types/types';
import {OrdersListProps} from './componentConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';
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
	TableFooter,
	TablePagination,
	TableSortLabel,
	Box,
} from '@mui/material';
import AlertMessage from '../../../Notification/AlertMessage';
import PrivateHeader from '../../../Headers/PrivateHeader';
import TablePaginationActions from '../../../Pagination/TablePaginationActions';
import {visuallyHidden} from '@mui/utils';


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


const OrdersList: FC<OrdersListProps> = () => {
	const [orders, setOrders] = useState<Order[]>([]);

	const [notify, setNotify] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [totalOrders, setTotalOrders] = useState<number>(0);
	const [sortedField, setSortField] = useState<string>('startWorkOn');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


	useEffect(() => {
		const readOrdersData = async () => {
			const {data} = await axios.get<{count: number, rows: Order[]}>(URL.ORDER, {
				params: {
					limit: rowsPerPage,
					offset: rowsPerPage * page,
				},
			});
			setOrders(data.rows);
			setTotalOrders(data.count);
		};

		readOrdersData();
	}, [rowsPerPage, page]);


	const onDelete = (id: string) => {
		if (window.confirm(`Do you want to delete order #${id.slice(0, 4)}?`)) {
			axios.delete(URL.ORDER,
				{
					data: {
						id,
					},
				}).then(() => {
				setOrders(orders.filter((order) => order.id !== id));
				setNotify(true);
			});
		}
	};

	const isOpen = (value:boolean) => {
		setNotify(value);
	};

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number,
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};


	return (
		<div>
			<PrivateHeader/>
			<div className={classes.conteiner}>
				<TableContainer component={Paper} sx={{width: '100%'}} className={classes.conteiner_table}>
					<Table sx={{minWidth: 650}} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell sx={{width: '6%'}}>
									<TableSortLabel
										active={sortedField === 'id' ? true : false}
										direction={sortedField === 'id' ? sortOrder : 'asc'}
									>
										Id

									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '8%'}} align="center">
									Clock size
								</StyledTableCell>
								<StyledTableCell sx={{width: '11%'}} align="center">
									User name
								</StyledTableCell>
								<StyledTableCell sx={{width: '18%'}} align="center">
									User Email
								</StyledTableCell>
								<StyledTableCell sx={{width: '8%'}} align="center">
									City
								</StyledTableCell>
								<StyledTableCell sx={{width: '11%'}} align="center">
									Master Name
								</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">
									Start on
								</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">
									Finish on
								</StyledTableCell>
								<StyledTableCell sx={{width: '20%'}} align="center"></StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders.map((order) => (
								<StyledTableRow key={order.id}>
									<StyledTableCell component="th" scope="row"> {order.id.slice(0, 4)} </StyledTableCell>
									<StyledTableCell align="center"> {order.clock.size} </StyledTableCell>
									<StyledTableCell align="center"> {order.user.name} </StyledTableCell>
									<StyledTableCell align="center"> {order.user.email} </StyledTableCell>
									<StyledTableCell align="center"> {order.city.name} </StyledTableCell>
									<StyledTableCell align="center"> {order.master.name} </StyledTableCell>
									<StyledTableCell align="center"> {order.startWorkOn.split('T').join(' ')} </StyledTableCell>
									<StyledTableCell align="center"> {order.endWorkOn.split('T').join(' ')} </StyledTableCell>
									<StyledTableCell align="center">
										{ !order.isCompleted ?
											<Link to={
												`/${RESOURCE.ADMIN}/${RESOURCE.ORDER_CREATE}/${order.id}`
											}>
												<Button
													variant="contained"
													sx={{width: '50%', fontSize: 14, borderRadius: 15}}
												>
													Update
												</Button>
											</Link> :
											<Button
												disabled={true}
												variant="contained"
												sx={{width: '50%', fontSize: 14, borderRadius: 15}}
											>
												Done!
											</Button>
										}
										<Button
											variant="contained"
											color='error'
											sx={{width: '50%', fontSize: 14, borderRadius: 15}}
											onClick={() => {
												onDelete(order.id);
											}}
										>
											Delete
										</Button>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TablePagination
									rowsPerPageOptions={[5, 10, 25, {label: 'All', value: totalOrders}]}
									colSpan={9}
									count={totalOrders}
									rowsPerPage={rowsPerPage}
									page={page}
									SelectProps={{
										inputProps: {
											'aria-label': 'rows per page',
										},
										native: true,
									}}
									onPageChange={handleChangePage}
									onRowsPerPageChange={handleChangeRowsPerPage}
									ActionsComponent={TablePaginationActions}
								/>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
				{
					notify && <AlertMessage alertType='success' message='Order has been deleted' isOpen={isOpen} notify={notify}/>
				}
			</div>
		</div>
	);
};

export default OrdersList;
