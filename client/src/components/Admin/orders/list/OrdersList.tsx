import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './orders-list.module.css';
import {
	Order,
	City,
	Master,
	Clock,
	AlertNotification,
	FiltersList,
	FilterInstances,
} from '../../../../data/types/types';
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
	Fab,
	Modal,
	ImageList,
	ImageListItem,
} from '@mui/material';
import {
	DesktopDateRangePicker,
	LocalizationProvider,
} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {FilterList} from '@mui/icons-material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import PrivateHeader from '../../../Headers/PrivateHeader';
import TablePaginationActions from '../../../Pagination/TablePaginationActions';
import {visuallyHidden} from '@mui/utils';
import {debouncer} from 'src/data/constants/systemUtilities';
import {SORTED_FIELD, SORTING_ORDER} from 'src/data/constants/systemConstants';
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


const OrdersList: FC<OrdersListProps> = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [cities, setCities] = useState<City[]>([]);
	const [masters, setMasters] = useState<Master[]>([]);
	const [clocks, setClocks] = useState<Clock[]>([]);

	const [masterName, setMasterName] = useState<string>('');
	const [cityName, setCityName] = useState<string>('');
	const [clockSize, setClockSize] = useState<string>('');

	const [filterInstances, setFilterInstances] = useState<FilterInstances>({
		city: null,
		master: null,
		clock: null,
		date: [null, null],
	});

	const [filtersList, setFiltersList] = useState<FiltersList>({});

	const [isFilterListOpen, setIsFilterListOpen] = useState<boolean>(false);

	const [isFilterButtonsDisabled, setIsFilterButtonsDisabled] = useState<{accept: boolean, reset: boolean}>({
		accept: false,
		reset: true,
	});

	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [totalOrders, setTotalOrders] = useState<number>(0);
	const [sortedField, setSortField] = useState<string>('id');
	const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('asc');

	const [loading, setLoading] = useState<boolean>(false);
	const [modalOptions, setModalOptions] = useState<{modalImg: string, isModalOpen: boolean}>({modalImg: '', isModalOpen: false});


	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});

	useEffect(() => {
		const readOrdersData = async () => {
			setLoading(true);
			axios.get<{count: number, rows: Order[]}>(URL.ORDER, {
				params: {
					limit: rowsPerPage,
					offset: rowsPerPage * page,
					sortedField,
					sortingOrder,
					masterFilteredId: filtersList.masterId,
					cityFilteredId: filtersList.cityId,
					clockFilteredId: filtersList.clockId,
					isCompletedFilter: filtersList.isCompleted,
					startDateFilter: filtersList.startWorkOn,
					endDateFilter: filtersList.endWorkOn,
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
		const {data} = await axios.get<Master[]>(URL.MASTER, {
			params: {
				limit: 5,
				offset: 0,
				masterName,
			},
		});

		if (data.length) {
			setMasters(data);
		}
	}, 200);

	const readCityData = debouncer(async () => {
		const {data} = await axios.get<City[]>(URL.CITY, {
			params: {
				limit: 5,
				offset: 0,
				cityName,
			},
		});

		if (data.length) {
			setCities(data);
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
		const isAsc = sortedField === field && sortingOrder === SORTING_ORDER.ASC;
		setSortingOrder(isAsc ? SORTING_ORDER.DESC : SORTING_ORDER.ASC);
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
				masterFilteredId: filtersList.masterId,
				cityFilteredId: filtersList.cityId,
				clockFilteredId: filtersList.clockId,
				isCompletedFilter: filtersList.isCompleted,
				startDateFilter: filtersList.startWorkOn,
				endDateFilter: filtersList.endWorkOn,
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
		setFilterInstances({
			master: null,
			city: null,
			clock: null,
			date: [null, null],
		});
		setFiltersList({
			masterId: null,
			clockId: null,
			cityId: null,
			isCompleted: null,
			startWorkOn: null,
			endWorkOn: null,
		});
		setIsFilterButtonsDisabled({
			accept: false,
			reset: true,
		});
		setLoading(false);
	};

	const handleOpenModalImg = (img: string) => setModalOptions({
		modalImg: img,
		isModalOpen: true,
	});
	const handleCloseModalImg = () => setModalOptions({
		modalImg: '',
		isModalOpen: false,
	});

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
								value={filterInstances.master}
								getOptionLabel={(option) => option.name}
								onChange={(e: React.SyntheticEvent<Element, Event>, value: Master | null) => {
									setFilterInstances({
										...filterInstances,
										master: value,
									});
									setFiltersList({
										...filtersList,
										masterId: value?.id,
									});
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
								value={filterInstances.city}
								getOptionLabel={(option) => option.name}
								onChange={(e: React.SyntheticEvent<Element, Event>, value: City | null) => {
									setFilterInstances({
										...filterInstances,
										city: value,
									});
									setFiltersList({
										...filtersList,
										cityId: value?.id,
									});
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
								value={filterInstances.clock}
								getOptionLabel={(option) => option.size}
								onChange={(e: React.SyntheticEvent<Element, Event>, value: Clock | null) => {
									setFilterInstances({
										...filterInstances,
										clock: value,
									});
									setFiltersList({
										...filtersList,
										clockId: value?.id,
									});
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
											setFiltersList({
												...filtersList,
												isCompleted: !filtersList.isCompleted,
											});
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
									value={filterInstances.date}
									onChange={(value) => {
										setFilterInstances({
											...filterInstances,
											date: value,
										});
										setFiltersList({
											...filtersList,
											startWorkOn: value[0],
											endWorkOn: value[1],
										});
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
										active={sortedField === SORTED_FIELD.ID}
										direction={sortedField === SORTED_FIELD.ID ? sortingOrder : SORTING_ORDER.ASC}
										onClick={() => {
											handleRequestSort(SORTED_FIELD.ID);
										}}
									>
										Id
										{sortedField === SORTED_FIELD.ID ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '8%'}} align="center">
									<TableSortLabel
										active={sortedField === SORTED_FIELD.CLOCK_SIZE}
										direction={sortedField === SORTED_FIELD.CLOCK_SIZE ? sortingOrder : SORTING_ORDER.ASC}
										onClick={() => {
											handleRequestSort(SORTED_FIELD.CLOCK_SIZE);
										}}
									>
										Clock size
										{sortedField === SORTED_FIELD.CLOCK_SIZE ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '11%'}} align="center">
									<TableSortLabel
										active={sortedField === SORTED_FIELD.USER_NAME}
										direction={sortedField === SORTED_FIELD.USER_NAME ? sortingOrder : SORTING_ORDER.ASC}
										onClick={() => {
											handleRequestSort(SORTED_FIELD.USER_NAME);
										}}
									>
										User name
										{sortedField === SORTED_FIELD.USER_NAME ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '12%'}} align="center">
									<TableSortLabel
										active={sortedField === SORTED_FIELD.USER_EMAIL}
										direction={sortedField === SORTED_FIELD.USER_EMAIL ? sortingOrder : SORTING_ORDER.ASC}
										onClick={() => {
											handleRequestSort(SORTED_FIELD.USER_EMAIL);
										}}
									>
										User Email
										{sortedField === SORTED_FIELD.USER_EMAIL ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '8%'}} align="center">
									<TableSortLabel
										active={sortedField === SORTED_FIELD.CITY_NAME}
										direction={sortedField === SORTED_FIELD.CITY_NAME ? sortingOrder : SORTING_ORDER.ASC}
										onClick={() => {
											handleRequestSort(SORTED_FIELD.CITY_NAME);
										}}
									>
										City
										{sortedField === SORTED_FIELD.CITY_NAME ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '11%'}} align="center">
									<TableSortLabel
										active={sortedField === SORTED_FIELD.MASTER_NAME}
										direction={sortedField === SORTED_FIELD.MASTER_NAME ? sortingOrder : SORTING_ORDER.ASC}
										onClick={() => {
											handleRequestSort(SORTED_FIELD.MASTER_NAME);
										}}
									>
										Master Name
										{sortedField === SORTED_FIELD.MASTER_NAME ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">
									<TableSortLabel
										active={sortedField === SORTED_FIELD.START_WORK_ON}
										direction={sortedField === SORTED_FIELD.START_WORK_ON ? sortingOrder : SORTING_ORDER.ASC}
										onClick={() => {
											handleRequestSort(SORTED_FIELD.START_WORK_ON);
										}}
									>
										Start On
										{sortedField === SORTED_FIELD.START_WORK_ON ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '10%'}} align="center">
									<TableSortLabel
										active={sortedField === SORTED_FIELD.END_WORK_ON}
										direction={sortedField === SORTED_FIELD.END_WORK_ON ? sortingOrder : SORTING_ORDER.ASC}
										onClick={() => {
											handleRequestSort(SORTED_FIELD.END_WORK_ON);
										}}
									>
										Finish On
										{sortedField === SORTED_FIELD.END_WORK_ON ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '6%'}} align="center">
									Photos
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
										<Fab
											size="small"
											component="span"
											aria-label="add"
											variant="extended"
											sx={{width: '90%'}}
											disabled={!order.images}
											onClick={() => {
												handleOpenModalImg(order.images);
											}}
										>
											<ImageOutlinedIcon />
										</Fab>
									</StyledTableCell>

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
									colSpan={10}
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
								{ loading && <TableCell colSpan={10}>
									<LinearProgress />
								</TableCell>}
							</TableRow>
						</TableFooter>
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

export default OrdersList;


