import axios from 'axios';
import React, {useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './orders-list.module.css';
import {
	City,
	Master,
	Clock,
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
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import {useDispatch, useSelector} from 'react-redux';
import {getCities, setCityName, setCityFilteringInstance} from 'src/store/actions/city';
import {getClocks, setClockSize, setClockFilteringInstance} from 'src/store/actions/clock';
import {getMasters, setMasterName, setMasterFilteringInstance} from 'src/store/actions/master';
import {
	getOrders,
	setOrdersPage,
	setOrdersLimit,
	setOrdersQuantity,
	setOrdersSortingField,
	setOrdersSortingOrder,
} from 'src/store/actions/order';
import {
	setMasterFilter,
	setCityFilter,
	setClockFilter,
	setIsCompletedFilter,
	setStartDateFilter,
	setEndDateFilter,
	setIsFiltersListOpen,
	setIsFiltersButtonsDisabled,
	setDateFilteringArray,
} from 'src/store/actions/orderFiltering';
import {setModalImg, setIsModalOpen} from 'src/store/actions/modal';
import {setAlertOptions} from 'src/store/actions/notification';
import {CombinedState} from 'redux';
import {NotificationState} from 'src/store/types/notification';
import {OrderState} from 'src/store/types/order';
import {OrderFilteringState} from 'src/store/types/orderFiltering';
import {CityState} from 'src/store/types/city';
import {ClockState} from 'src/store/types/clock';
import {ModalState} from 'src/store/types/modal';
import {MasterState} from 'src/store/types/master';


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
	const {
		orders,
		loading,
		page,
		limit,
		totalQuantity,
		sortedField,
		sortingOrder,
	} = useSelector((state: CombinedState<{order: OrderState}>) => state.order);

	const {
		cities,
		cityName,
		cityFilteringInstance,
	} = useSelector((state: CombinedState<{city: CityState}>) => state.city);

	const {
		masters,
		masterName,
		masterFilteringInstance,
	} = useSelector((state: CombinedState<{master: MasterState}>) => state.master);

	const {
		clocks,
		clockSize,
		clockFilteringInstance,
	} = useSelector((state: CombinedState<{clock: ClockState}>) => state.clock);

	const {
		masterFilteredId,
		cityFilteredId,
		clockFilteredId,
		isCompletedFilter,
		dateFilteringArray,
		startDateFilter,
		endDateFilter,
		isFiltersListOpen,
		isFiltersButtonsDisabled,
	} = useSelector((state: CombinedState<{orderFiltering: OrderFilteringState}>) => state.orderFiltering);

	const {
		alertOptions,
	} = useSelector((state: CombinedState<{notification: NotificationState}>) => state.notification);

	const {
		modalImg,
		isModalOpen,
	} = useSelector((state: CombinedState<{modal: ModalState}>) => state.modal);

	const dispatch = useDispatch();


	useEffect(() => {
		dispatch(getOrders(
			page,
			limit,
			sortedField,
			sortingOrder,
			masterFilteredId,
			cityFilteredId,
			clockFilteredId,
			isCompletedFilter,
			startDateFilter,
			endDateFilter,
		));
		dispatch(setOrdersQuantity(totalQuantity));
	}, [limit, page, sortedField, sortingOrder]);

	const getDebouncedCities = debouncer(() => {
		dispatch(getCities(cityName));
	}, 200);

	const getDebouncedMasters = debouncer(() => {
		dispatch(getMasters(masterName));
	}, 200);

	const getDebouncedClocks = debouncer(() => {
		dispatch(getClocks(clockSize));
	}, 200);

	useEffect(() => {
		getDebouncedMasters();
	}, [masterName]);

	useEffect(() => {
		getDebouncedCities();
	}, [cityName]);


	useEffect(() => {
		getDebouncedClocks();
	}, [clockSize]);


	const onDelete = (id: string) => {
		if (window.confirm(`Do you want to delete order #${id.slice(0, 4)}?`)) {
			axios.delete(URL.ORDER,
				{
					data: {
						id,
					},
				}).then(() => {
				dispatch(getOrders(
					page,
					limit,
					sortedField,
					sortingOrder,
					masterFilteredId,
					cityFilteredId,
					clockFilteredId,
					isCompletedFilter,
					startDateFilter,
					endDateFilter,
				));
				dispatch(setOrdersQuantity(totalQuantity));
				dispatch(setAlertOptions('Order has been deleted!', true, 'success'));
			});
		}
	};

	const isOpen = (value:boolean) => {
		dispatch(setAlertOptions(alertOptions.message, value, alertOptions.type));
	};

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number,
	) => {
		dispatch(setOrdersPage(newPage));
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		dispatch(setOrdersLimit(parseInt(event.target.value, 10)));
		dispatch(setOrdersPage(0));
	};

	const handleRequestSort = (field: string) => {
		const isAsc = sortedField === field && sortingOrder === 'asc';
		dispatch(setOrdersSortingOrder(isAsc ? 'desc' : 'asc'));
		dispatch(setOrdersSortingField(field));
	};

	const handleFilterList = () => {
		dispatch(setIsFiltersListOpen(!isFiltersListOpen));
	};

	const handleAcceptFilter = async () => {
		dispatch(setIsFiltersButtonsDisabled(true, false));
		dispatch(getOrders(
			page,
			limit,
			sortedField,
			sortingOrder,
			masterFilteredId,
			cityFilteredId,
			clockFilteredId,
			isCompletedFilter,
			startDateFilter,
			endDateFilter,
		));
		dispatch(setOrdersQuantity(totalQuantity));
		dispatch(setOrdersPage(0));
	};

	const handleResetFilter = async () => {
		dispatch(setMasterFilter(null));
		dispatch(setMasterFilteringInstance(null));
		dispatch(setCityFilter(null));
		dispatch(setCityFilteringInstance(null));
		dispatch(setClockFilter(null));
		dispatch(setClockFilteringInstance(null));
		dispatch(setDateFilteringArray([null, null]));
		dispatch(setStartDateFilter(null));
		dispatch(setEndDateFilter(null));
		dispatch(setIsFiltersButtonsDisabled(false, true));
		dispatch(getOrders(page, limit, sortedField, sortingOrder));
		dispatch(setOrdersQuantity(totalQuantity));
		dispatch(setIsCompletedFilter(null));
	};

	const handleOpenModalImg = (img: string) => {
		dispatch(setModalImg(img));
		dispatch(setIsModalOpen(true));
	};

	const handleCloseModalImg = () => {
		dispatch(setModalImg(''));
		dispatch(setIsModalOpen(false));
	};


	return (
		<div>
			<PrivateHeader/>
			<div className={classes.conteiner}>
				{
					isFiltersListOpen &&
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
								value={masterFilteringInstance}
								getOptionLabel={(option) => option.name}
								onChange={(e: React.SyntheticEvent<Element, Event>, value: Master | null) => {
									dispatch(setMasterFilteringInstance(value));
									dispatch(setMasterFilter(value ? value.id : value));
									dispatch(setIsFiltersButtonsDisabled(false, isFiltersButtonsDisabled.reset));
								}}
								onInputChange={(MasterNameEvent: React.SyntheticEvent<Element, Event>, value: string) => {
									dispatch(setMasterName(value));
								}}
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
								value={cityFilteringInstance}
								getOptionLabel={(option) => option.name}
								onChange={(e: React.SyntheticEvent<Element, Event>, value: City | null) => {
									dispatch(setCityFilteringInstance(value));
									dispatch(setCityFilter(value ? value.id : value));
									dispatch(setIsFiltersButtonsDisabled(false, isFiltersButtonsDisabled.reset));
								}}
								onInputChange={(CityNameEvent: React.SyntheticEvent<Element, Event>, value: string) => {
									dispatch(setCityName(value));
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
								value={clockFilteringInstance}
								getOptionLabel={(option) => option.size}
								onChange={(e: React.SyntheticEvent<Element, Event>, value: Clock | null) => {
									dispatch(setClockFilteringInstance(value));
									dispatch(setClockFilter(value ? value.id : value));
									dispatch(setIsFiltersButtonsDisabled(false, isFiltersButtonsDisabled.reset));
								}}
								onInputChange={(ClockSizeEvent: React.SyntheticEvent<Element, Event>, value: string) => {
									dispatch(setClockSize(value));
								}}
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
											dispatch(setIsCompletedFilter(!isCompletedFilter));
											dispatch(setIsFiltersButtonsDisabled(false, isFiltersButtonsDisabled.reset));
										}}
										checked={Boolean(isCompletedFilter)}
									/>
								}
								label="Completed orders"
							/>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DesktopDateRangePicker
									startText='Sort on start date'
									endText='Sort on end date'
									value={dateFilteringArray}
									onChange={(value) => {
										dispatch(setDateFilteringArray(value));
										dispatch(setStartDateFilter(value[0]));
										dispatch(setEndDateFilter(value[1]));
										dispatch(setIsFiltersButtonsDisabled(false, isFiltersButtonsDisabled.reset));
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
								disabled={isFiltersButtonsDisabled.accept}
							>
								Accept filters
							</Button>
							<Button
								variant="contained"
								style={ {fontSize: 14, backgroundColor: 'red', borderRadius: 15} }
								onClick={handleResetFilter}
								disabled={isFiltersButtonsDisabled.reset}
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
								<StyledTableCell sx={{width: '12%'}} align="center">
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
											disabled={order.images ? false : true}
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
										colSpan={10}
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
									rowsPerPageOptions={[5, 10, 25, {label: 'All', value: totalQuantity}]}
									colSpan={10}
									count={totalQuantity}
									rowsPerPage={limit}
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
					open={isModalOpen}
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
							{modalImg.split(',').map((item) => (
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
