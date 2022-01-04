import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './orders-list.module.css';
import {Order, City} from '../../../../data/types/types';
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
	IconButton,
	Select,
	Stack,
	Checkbox,
	FormControlLabel,
	Autocomplete,
	TextField,
	InputLabel,
	MenuItem,
	OutlinedInput,
	FormControl,
} from '@mui/material';
import {FilterList} from '@mui/icons-material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import PrivateHeader from '../../../Headers/PrivateHeader';
import TablePaginationActions from '../../../Pagination/TablePaginationActions';
import {visuallyHidden} from '@mui/utils';
import CitiesList from '../../cities/list/CitiesList';



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
	const [cities, setCities] = useState<City[]>([]);

	const [notify, setNotify] = useState<boolean>(false);
	const [isFilterListOpen, setIsFilterListOpen] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [totalOrders, setTotalOrders] = useState<number>(0);
	const [sortedField, setSortField] = useState<string>('id');
	const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('asc');


	useEffect(() => {
		const readOrdersData = async () => {
			const {data} = await axios.get<{count: number, rows: Order[]}>(URL.ORDER, {
				params: {
					limit: rowsPerPage,
					offset: rowsPerPage * page,
					sortedField,
					sortingOrder,
				},
			});
			setOrders(data.rows);
			setTotalOrders(data.count);
		};

		readOrdersData();
	}, [rowsPerPage, page, sortedField, sortingOrder]);


	useEffect(() => {
		const readCitiesData = async () => {
			const {data} = await axios.get<City[]>(URL.CITY);

			if (data.length) {
				setCities(data);
			}
		};

		readCitiesData();
	}, []);


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

	const handleRequestSort = (field: string) => {
		const isAsc = sortedField === field && sortingOrder === 'asc';
		setSortingOrder(isAsc ? 'desc' : 'asc');
		setSortField(field);
	};

	const handleFilterList = () => {
		setIsFilterListOpen((prev) => !prev);
	};

	return (
		<div>
			<PrivateHeader/>
			<div className={classes.conteiner}>
				{
					isFilterListOpen &&
					<Box
						sx={{
							width: '100%',
							backgroundColor: 'secondary.main',
							padding: 3,
						}}
					>
						<Stack
							direction="row"
							justifyContent="center"
							alignItems="center"
							spacing={5}
						>
							<Autocomplete
								disablePortal
								id="combo-box-demo"
								options={[{label: 'master 1'},
									{label: 'master 2'}]}
								sx={{width: 300, height: 25}}
								renderInput={(params) => <TextField {...params} label="Sort on master name" />}
							/>
							<Select
								id='cityId'
								name='cityId'
								labelId='cityId'
								sx={{height: 25}}
								displayEmpty
								label="City"
							></Select>
							<Select
								id='clockId'
								name='clockId'
								labelId='clockId'
								sx={{height: 25}}
								displayEmpty
								label="Clock"
							></Select>
							<FormControlLabel
								control={
									<Checkbox name="isCompleted" />
								}
								label="Only completed orders"
							/>
							<Button
								variant="contained"
								type="submit"
								style={ {fontSize: 14, backgroundColor: 'green', borderRadius: 15} }
							>
								Accept filters
							</Button>
						</Stack>
					</Box>
				}
				<TableContainer component={Paper} sx={{width: '100%'}} className={classes.conteiner_table}>
					<Table sx={{minWidth: 650}} aria-label="customized table">

						<TableHead>
							<TableRow>
								<StyledTableCell sx={{width: '6%'}}>
									<TableSortLabel
										active={sortedField === 'id' ? true : false}
										direction={sortedField === 'id' ? sortingOrder : 'asc'}
										onClick={() => {
											handleRequestSort('id');
										}}
									>
										Id
										{sortedField === 'id' ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '8%'}} align="center">
									<TableSortLabel
										active={sortedField === 'clock.size' ? true : false}
										direction={sortedField === 'clock.size' ? sortingOrder : 'asc'}
										onClick={() => {
											handleRequestSort('clock.size');
										}}
									>
										Clock size
										{sortedField === 'clock.size' ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '11%'}} align="center">
									<TableSortLabel
										active={sortedField === 'user.name' ? true : false}
										direction={sortedField === 'user.name' ? sortingOrder : 'asc'}
										onClick={() => {
											handleRequestSort('user.name');
										}}
									>
										User name
										{sortedField === 'user.name' ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '18%'}} align="center">
									<TableSortLabel
										active={sortedField === 'user.email' ? true : false}
										direction={sortedField === 'user.email' ? sortingOrder : 'asc'}
										onClick={() => {
											handleRequestSort('user.email');
										}}
									>
										User Email
										{sortedField === 'user.email' ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '8%'}} align="center">
									<TableSortLabel
										active={sortedField === 'city.name' ? true : false}
										direction={sortedField === 'city.name' ? sortingOrder : 'asc'}
										onClick={() => {
											handleRequestSort('city.name');
										}}
									>
										City
										{sortedField === 'city.name' ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '11%'}} align="center">
									<TableSortLabel
										active={sortedField === 'master.name' ? true : false}
										direction={sortedField === 'master.name' ? sortingOrder : 'asc'}
										onClick={() => {
											handleRequestSort('master.name');
										}}
									>
										Master Name
										{sortedField === 'master.name' ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">
									<TableSortLabel
										active={sortedField === 'startWorkOn' ? true : false}
										direction={sortedField === 'startWorkOn' ? sortingOrder : 'asc'}
										onClick={() => {
											handleRequestSort('startWorkOn');
										}}
									>
										Start On
										{sortedField === 'startWorkOn' ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">
									<TableSortLabel
										active={sortedField === 'endWorkOn' ? true : false}
										direction={sortedField === 'endWorkOn' ? sortingOrder : 'asc'}
										onClick={() => {
											handleRequestSort('endWorkOn');
										}}
									>
										Finish On
										{sortedField === 'endWorkOn' ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '20%'}} align="right">
									<IconButton
										style={{marginLeft: 'auto'}}
										color='inherit'
										aria-label='filterButton'
										onClick={handleFilterList}
									>
										<FilterList />
									</IconButton>
								</StyledTableCell>
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
