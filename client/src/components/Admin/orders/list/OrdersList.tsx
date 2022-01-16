import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './orders-list.module.css';
import {Order, City, Master, Clock, AlertNotification} from '../../../../data/types/types';
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
	Stack,
	Checkbox,
	FormControlLabel,
	Autocomplete,
	TextField,
	LinearProgress,
	Typography,
} from '@mui/material';
import {
	DesktopDateRangePicker,
	DateRange,
	LocalizationProvider,
} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {FilterList} from '@mui/icons-material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import PrivateHeader from '../../../Headers/PrivateHeader';
import TablePaginationActions from '../../../Pagination/TablePaginationActions';
import {visuallyHidden} from '@mui/utils';
import {debouncer} from 'src/data/constants/systemUtilities';


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
	const [masters, setMasters] = useState<Master[]>([]);
	const [clocks, setClocks] = useState<Clock[]>([]);

	const [masterName, setMasterName] = useState<string>('');
	const [masterFilter, setMasterFilter] = useState<Master | null>(null);

	const [cityName, setCityName] = useState<string>('');
	const [cityFilter, setCityFilter] = useState<City | null>(null);

	const [clockSize, setClockSize] = useState<string>('');
	const [clockFilter, setClockFilter] = useState<Clock | null>(null);

	const [dateFilter, setDateFilter] = useState<DateRange<Date>>([null, null]);

	const [isCompletedFilter, setIsCompletedFilter] = useState<boolean | null>(null);

	const [isFilterButtonsDisabled, setIsFilterButtonsDisabled] = useState<{accept: boolean, reset: boolean}>({
		accept: false,
		reset: true,
	});

	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});

	const [isFilterListOpen, setIsFilterListOpen] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [totalOrders, setTotalOrders] = useState<number>(0);
	const [sortedField, setSortField] = useState<string>('id');
	const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('asc');

	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const readOrdersData = async () => {
			setLoading(true);
			await axios.get<{count: number, rows: Order[]}>(URL.ORDER, {
				params: {
					limit: rowsPerPage,
					offset: rowsPerPage * page,
					sortedField,
					sortingOrder,
					masterFilteredId: masterFilter?.id,
					cityFilteredId: cityFilter?.id,
					clockFilteredId: clockFilter?.id,
					isCompletedFilter,
					startDateFilter: dateFilter[0],
					endDateFilter: dateFilter[1],
				},
			}).then((response) => {
				setOrders(response.data.rows);
				setTotalOrders(response.data.count);
				setLoading(false);
			}).catch(() => {
				setLoading(false);
				setAlertOptions({
					type: 'warning',
					message: 'There is an error occurred while fetching data!',
					notify: true,
				});
			});
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


	useEffect(() => {
		readMasterData();
	}, [masterName]);


	useEffect(() => {
		readCityData();
	}, [cityName]);


	useEffect(() => {
		readClockData();
	}, [clockSize]);


	const readMasterData = debouncer(async () => {
		const {data} = await axios.get<{count: number, rows: Master[]}>(URL.MASTER, {
			params: {
				limit: 5,
				offset: 0,
				masterName,
			},
		});

		if (data.rows.length) {
			setMasters(data.rows);
		}
	}, 200);

	const readCityData = debouncer(async () => {
		const {data} = await axios.get<{count: number, rows: City[]}>(URL.CITY, {
			params: {
				limit: 5,
				offset: 0,
				cityName,
			},
		});

		if (data.rows.length) {
			setCities(data.rows);
		}
	}, 200);

	const readClockData = debouncer(async () => {
		const {data} = await axios.get<Clock[]>(URL.CLOCK, {
			params: {
				clockSize,
			},
		});

		if (data.length) {
			setClocks(data);
		}
	}, 200);

	const onDelete = (id: string) => {
		if (window.confirm(`Do you want to delete order #${id.slice(0, 4)}?`)) {
			axios.delete(URL.ORDER,
				{
					data: {
						id,
					},
				}).then(() => {
				setOrders(orders.filter((order) => order.id !== id));
				setAlertOptions({
					type: 'success',
					message: 'Order has been deleted!',
					notify: true,
				});
			});
		}
	};

	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
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

	const handleAcceptFilter = async () => {
		setLoading(true);
		const {data} = await axios.get<{count: number, rows: Order[]}>(URL.ORDER, {
			params: {
				limit: rowsPerPage,
				offset: rowsPerPage * page,
				sortedField,
				sortingOrder,
				masterFilteredId: masterFilter?.id,
				cityFilteredId: cityFilter?.id,
				clockFilteredId: clockFilter?.id,
				isCompletedFilter,
				startDateFilter: dateFilter[0],
				endDateFilter: dateFilter[1],
			},
		});
		setOrders(data.rows);
		setTotalOrders(data.count);
		setIsFilterButtonsDisabled({
			accept: true,
			reset: false,
		});
		setPage(0);
		setLoading(false);
	};

	const handleResetFilter = async () => {
		setLoading(true);
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
		setMasterFilter(null);
		setCityFilter(null);
		setClockFilter(null);
		setIsCompletedFilter(null);
		setDateFilter([null, null]);
		setIsFilterButtonsDisabled({
			accept: false,
			reset: true,
		});
		setLoading(false);
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
							pt: 3,
							pb: 3,
						}}
						style={{backgroundColor: '#a3a29b'}}
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
								options={masters}
								value={masterFilter}
								getOptionLabel={(option) => option.name}
								onChange={(e: React.SyntheticEvent<Element, Event>, value: Master | null) => {
									setMasterFilter(value);
									setIsFilterButtonsDisabled({
										...isFilterButtonsDisabled,
										accept: false,
									});
								}}
								onInputChange={
									(MasterNameEvent: React.SyntheticEvent<Element, Event>, value: string) => setMasterName(value)
								}
								sx={{width: 200}}
								renderInput={(params) =>
									<TextField {...params}
										label="Sort on master name"
									/>}
							/>
							<Autocomplete
								disablePortal
								id="combo-box-demo"
								options={cities}
								value={cityFilter}
								getOptionLabel={(option) => option.name}
								onChange={(e: React.SyntheticEvent<Element, Event>, value: City | null) => {
									setCityFilter(value);
									setIsFilterButtonsDisabled({
										...isFilterButtonsDisabled,
										accept: false,
									});
								}}
								onInputChange={(CityNameEvent: React.SyntheticEvent<Element, Event>, value: string) => {
									setCityName(value);
									setIsFilterButtonsDisabled({
										...isFilterButtonsDisabled,
										accept: false,
									});
								}}
								sx={{width: 200}}
								renderInput={(params) =>
									<TextField {...params}
										label="Sort on city name"
									/>}
							/>
							<Autocomplete
								disablePortal
								id="combo-box-demo"
								options={clocks}
								value={clockFilter}
								getOptionLabel={(option) => option.size}
								onChange={(e: React.SyntheticEvent<Element, Event>, value: Clock | null) => {
									setClockFilter(value);
									setIsFilterButtonsDisabled({
										...isFilterButtonsDisabled,
										accept: false,
									});
								}}
								onInputChange={(ClockSizeEvent: React.SyntheticEvent<Element, Event>, value: string) => setClockSize(value)}
								sx={{width: 200}}
								renderInput={(params) =>
									<TextField {...params}
										label="Sort on clock size"
									/>}
							/>
							<FormControlLabel
								control={
									<Checkbox
										name="isCompleted"
										onChange={() => {
											setIsCompletedFilter((prev) => !prev);
											setIsFilterButtonsDisabled({
												...isFilterButtonsDisabled,
												accept: false,
											});
										}}
									/>
								}
								label="Completed orders"
							/>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DesktopDateRangePicker
									startText='Sort on start date'
									endText='Sort on end date'
									value={dateFilter}
									onChange={(value) => {
										setDateFilter(value);
										setIsFilterButtonsDisabled({
											...isFilterButtonsDisabled,
											accept: false,
										});
									}}
									renderInput={(startProps, endProps) => (
										<>
											<TextField {...startProps} sx={{width: 150}} />
											<Box sx={{mx: 2}}> - </Box>
											<TextField {...endProps} sx={{width: 150}}/>
										</>
									)}
								/>
							</LocalizationProvider>

							<Button
								variant="contained"
								style={ {fontSize: 14, backgroundColor: 'green', borderRadius: 15} }
								onClick={handleAcceptFilter}
								disabled={isFilterButtonsDisabled.accept}
							>
								Accept filters
							</Button>
							<Button
								variant="contained"
								style={ {fontSize: 14, backgroundColor: 'red', borderRadius: 15} }
								onClick={handleResetFilter}
								disabled={isFilterButtonsDisabled.reset}
							>
								Reset filters
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
											{loading ? 'Loading...' : 'There are no data matching the fetch!'}
										</Typography>
									</TableCell>
								</TableRow>
							}
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
							<TableRow>
								{ loading && <TableCell colSpan={9}>
									<LinearProgress />
								</TableCell>}
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
				{
					alertOptions.notify && <AlertMessage alertType={alertOptions.type} message={alertOptions.message} isOpen={isOpen} notify={alertOptions.notify}/>
				}
			</div>
		</div>
	);
};

export default OrdersList;


