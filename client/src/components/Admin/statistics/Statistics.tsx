/* eslint-disable quotes */
import axios from 'axios';
import React, {useEffect, useState, FC} from 'react';
import {StatisticsProps} from './componentConstants';
import classes from './statistics.module.css';
import {
	Paper,
	Stack,
	TextField,
	Box,
	FormControl,
	InputLabel,
	Select,
	OutlinedInput,
	MenuItem,
	SelectChangeEvent,
	TableCell,
	tableCellClasses,
	TableRow,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableFooter,
	TablePagination,
	TableSortLabel,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {
	Chart,
	BarSeries,
	ArgumentAxis,
	ValueAxis,
	PieSeries,
	Legend,
	Tooltip,
	Title,
} from '@devexpress/dx-react-chart-material-ui';
import PrivateHeader from '../../Headers/PrivateHeader';
import {Palette} from '@devexpress/dx-react-chart';
import {schemeCategory10} from 'd3-scale-chromatic';
import {DesktopDateRangePicker, LocalizationProvider} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {AlertNotification, City, Master, MastersStatisticsData} from 'src/data/types/types';
import {URL} from '../../../data/constants/routeConstants';
import {DateRange} from '@mui/lab/DateRangePicker/RangeTypes';
import {EventTracker} from '@devexpress/dx-react-chart';
import TablePaginationActions from 'src/components/Pagination/TablePaginationActions';
import {SORTED_FIELD, SORTING_ORDER} from 'src/data/constants/systemConstants';
import {visuallyHidden} from '@mui/utils';
import AlertMessage from 'src/components/Notification/AlertMessage';

const StyledTableCell = styled(TableCell)(({theme}) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.primary.main,
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


const Statistics: FC<StatisticsProps> = () => {
	const [cities, setCities] = useState<City[] | null>(null);
	const [masters, setMasters] = useState<Master[] | null>(null);

	const [citiesId, setCitiesId] = useState<number[]>([] as number[]);
	const [mastersId, setMastersId] = useState<string[]>([] as string[]);

	const [dateRangeChart, setDateRangeChart] = useState<DateRange<Date>>([null, null]);
	const [dateRangeCitiesPieChart, setDateRangeCitiesPieChart] = useState<DateRange<Date>>([null, null]);
	const [dateRangeMastersPieChart, setDateRangeMastersPieChart] = useState<DateRange<Date>>([null, null]);

	const [ordersForChart, setOrdersForChart] = useState<{orders: number, date: string}[]>([]);
	const [ordersForCitiesPieChart, setOrdersForCitiesPieChart] = useState<{orders: number, city: string}[]>([]);
	const [ordersForMastersPieChart, setOrdersForMastersPieChart] = useState<{orders: number, master: string}[]>([]);

	const [mastersStatisticsData, setMastersStatisticsData] = useState<MastersStatisticsData[]>([]);
	const [mastersStatisticsPage, setMastersStatisticsPage] = useState<number>(0);
	const [totalMasters, setTotalMasters] = useState<number>(0);
	const [mastersStatisticsLimit, setMastersStatisticsLimit] = useState<number>(5);

	const [sortingOptions, setSortingOptions] = useState<{sortingField: string, sortingOrder: 'asc' | 'desc'}>({
		sortingField: 'name',
		sortingOrder: 'asc',
	});

	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'error',
		message: 'There are no data for chosen period',
	});


	useEffect(() => {
		const getCities = async () => {
			axios.get<City[]>(URL.CITY).then((response) => {
				setCities(response.data);
			});
		};

		getCities();
	}, []);

	useEffect(() => {
		const getMasters = async () => {
			axios.get<Master[]>(URL.MASTER).then((response) => {
				setMasters(response.data);
			});
		};

		getMasters();
	}, []);

	useEffect(() => {
		const getChartTotalOrders = async () => {
			axios.get<{orders: number, date: string}[]>(URL.TOTAL_ORDERS_CHART, {
				params: {
					startDate: dateRangeChart[0],
					endDate: dateRangeChart[1],
					mastersFilter: mastersId.length ? "'" + mastersId.join("','") + "'" : null,
					citiesFilter: citiesId.length ? citiesId.join(',') : null,
				},
			}).then((response) => {
				if (!response.data.length) {
					setMastersId([]);
					setCitiesId([]);
					setDateRangeChart([null, null]);
					setAlertOptions({...alertOptions, notify: true});
				} else {
					setOrdersForChart(response.data);
				}
			});
		};

		getChartTotalOrders();
	}, [dateRangeChart, mastersId, citiesId]);

	useEffect(() => {
		const getChartPieCitiesTotalOrders = async () => {
			axios.get<{orders: number, city: string}[]>(URL.TOTAL_ORDERS_CITIES_PIE_CHART, {
				params: {
					startDate: dateRangeCitiesPieChart[0],
					endDate: dateRangeCitiesPieChart[1],
				},
			}).then((response) => {
				if (!response.data.length) {
					setDateRangeCitiesPieChart([null, null]);
					setAlertOptions({...alertOptions, notify: true});
				} else {
					setOrdersForCitiesPieChart(response.data);
				}
			});
		};

		getChartPieCitiesTotalOrders();
	}, [dateRangeCitiesPieChart]);

	useEffect(() => {
		const getChartPieMastersTotalOrders = async () => {
			axios.get<{orders: number, master: string}[]>(URL.TOTAL_ORDERS_MASTERS_PIE_CHART, {
				params: {
					startDate: dateRangeMastersPieChart[0],
					endDate: dateRangeMastersPieChart[1],
				},
			}).then((response) => {
				const filteredOrders = response.data?.filter((elem) => elem.orders !== null);
				if (!filteredOrders?.length) {
					setDateRangeMastersPieChart([null, null]);
					setAlertOptions({...alertOptions, notify: true});
				} else {
					setOrdersForMastersPieChart(filteredOrders);
				}
			});
		};

		getChartPieMastersTotalOrders();
	}, [dateRangeMastersPieChart]);

	useEffect(() => {
		const getMastersStatisticsForTable = async () => {
			axios.get<{count: number, statistics: MastersStatisticsData[]}>(URL.MASTERS_STATISTICS_TABLE, {
				params: {
					limit: mastersStatisticsLimit,
					offset: mastersStatisticsPage * mastersStatisticsLimit,
					sortingField: sortingOptions.sortingField,
					sortingOrder: sortingOptions.sortingOrder,
				},
			}).then((response) => {
				setMastersStatisticsData(response.data.statistics);
				setTotalMasters(response.data.count);
			});
		};

		getMastersStatisticsForTable();
	}, [mastersStatisticsLimit, mastersStatisticsPage, sortingOptions]);


	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number,
	) => {
		setMastersStatisticsPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setMastersStatisticsLimit(parseInt(event.target.value, 10));
		setMastersStatisticsPage(0);
	};

	const handleRequestSort = (field: string) => {
		const isAsc = sortingOptions.sortingField === field && sortingOptions.sortingOrder === SORTING_ORDER.ASC;
		setSortingOptions({
			sortingOrder: isAsc ? SORTING_ORDER.DESC : SORTING_ORDER.ASC,
			sortingField: field,
		});
	};

	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};


	return (
		<div>
			<PrivateHeader/>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<div className={classes.container}>
					<Stack direction='column' spacing={3} justifyContent='center'>
						<Paper sx={{width: '100%'}} elevation={4}>
							<Box sx={{m: '20px auto', width: '80%'}}>
								<Stack direction='row' spacing={2} justifyContent='center'>
									<DesktopDateRangePicker
										startText='Sort on start date'
										endText='Sort on end date'
										maxDate={new Date()}
										value={dateRangeChart}
										onChange={(value) => {
											setDateRangeChart(value);
										}}
										renderInput={(startProps, endProps) => (
											<>
												<TextField {...startProps} sx={{width: 250}} />
												<Box sx={{mx: 2}}> - </Box>
												<TextField {...endProps} sx={{width: 250}} />
											</>
										)}
									/>
									<FormControl
										fullWidth
									>
										<InputLabel id="cities">Cities</InputLabel>
										<Select
											id='citiesId'
											name='citiesId'
											labelId='cities'
											multiple
											value={citiesId}
											onChange={(citiesIdEvent: SelectChangeEvent<any>) => {
												const {target: {value}} = citiesIdEvent;
												setCitiesId([...value]);
												setMastersId([]);
											}}
											input={<OutlinedInput label="Cities" />}
											MenuProps={{
												sx: {
													'&& .Mui-selected': {
														backgroundColor: '#0094fd5c',
													},
												},
											}}
										>
											{cities?.map((city) => (
												<MenuItem
													key={city.id}
													value={city.id}
												>
													{city.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<FormControl
										fullWidth
									>
										<InputLabel id="masters">Masters</InputLabel>
										<Select
											id='mastersId'
											name='mastersId'
											labelId='masters'
											multiple
											value={mastersId}
											onChange={(mastersIdEvent: SelectChangeEvent<any>) => {
												const {target: {value}} = mastersIdEvent;
												setMastersId([...value]);
												setCitiesId([]);
											}}
											input={<OutlinedInput label="Masters" />}
											MenuProps={{
												sx: {
													'&& .Mui-selected': {
														backgroundColor: '#0094fd5c',
													},
												},
											}}
										>
											{masters?.map((master) => (
												<MenuItem
													key={master.id}
													value={master.id}
												>
													{master.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Stack>
							</Box>
							<Chart
								data={ordersForChart}
							>
								<ArgumentAxis />
								<ValueAxis />
								<Legend />
								<BarSeries
									name="Orders"
									valueField="orders"
									argumentField="date"
								/>
								<EventTracker />
								<Tooltip />
								<Title
									text="Orders quantity"
								/>
							</Chart>
						</Paper>
						<Stack direction='row' spacing={3} justifyContent='center'>
							<Paper sx={{width: '50%'}} elevation={4}>
								<Chart
									data={ordersForCitiesPieChart}
								>
									<Palette scheme={schemeCategory10} />
									<PieSeries
										valueField="orders"
										argumentField="city"
									/>
									<EventTracker />
									<Tooltip />
									<Legend />
									<Title
										text="Orders quantity on cities"
									/>
								</Chart>
								<Box sx={{m: '20px auto', width: '100%'}}>
									<Stack direction='row' spacing={2} justifyContent='center'>
										<DesktopDateRangePicker
											startText='Sort on start date'
											endText='Sort on end date'
											maxDate={new Date()}
											value={dateRangeCitiesPieChart}
											onChange={(value) => {
												setDateRangeCitiesPieChart(value);
											}}
											renderInput={(startProps, endProps) => (
												<>
													<TextField {...startProps} sx={{width: 350}} />
													<Box sx={{mx: 2}}> - </Box>
													<TextField {...endProps} sx={{width: 350}} />
												</>
											)}
										/>
									</Stack>
								</Box>
							</Paper>
							<Paper sx={{width: '50%'}} elevation={4}>
								<Chart
									data={ordersForMastersPieChart}
								>
									<Palette scheme={schemeCategory10} />
									<PieSeries
										valueField="orders"
										argumentField="master"
									/>
									<EventTracker />
									<Tooltip />
									<Legend />
									<Title
										text="Orders quantity on masters"
									/>
								</Chart>
								<Box sx={{m: '20px auto', width: '100%', justifyContent: 'center'}}>
									<Stack direction='row' spacing={2} justifyContent='center'>
										<DesktopDateRangePicker
											startText='Sort on start date'
											endText='Sort on end date'
											maxDate={new Date()}
											value={dateRangeMastersPieChart}
											onChange={(value) => {
												setDateRangeMastersPieChart(value);
											}}
											renderInput={(startProps, endProps) => (
												<>
													<TextField {...startProps} sx={{width: 350}} />
													<Box sx={{mx: 2}}> - </Box>
													<TextField {...endProps} sx={{width: 350}} />
												</>
											)}
										/>
									</Stack>
								</Box>
							</Paper>
						</Stack>
						<TableContainer component={Paper} sx={{width: '100%'}} elevation={4} className={classes.container_table}>
							<Table sx={{minWidth: 650}} aria-label="customized table">
								<TableHead>
									<TableRow>
										<StyledTableCell sx={{width: '12%'}} align="center">
											<TableSortLabel
												active={sortingOptions.sortingField === SORTED_FIELD.NAME}
												direction={sortingOptions.sortingField === SORTED_FIELD.NAME ?
													sortingOptions.sortingOrder : SORTING_ORDER.ASC}
												onClick={() => {
													handleRequestSort(SORTED_FIELD.NAME);
												}}
											>
												Master Name
												{sortingOptions.sortingField === SORTED_FIELD.NAME ? (
													<Box
														component="span"
														sx={visuallyHidden}
													/>
												) : null}
											</TableSortLabel>
										</StyledTableCell>
										<StyledTableCell sx={{width: '12%'}} align="center">
											<TableSortLabel
												active={sortingOptions.sortingField === SORTED_FIELD.SMALL_CLOCKS}
												direction={sortingOptions.sortingField === SORTED_FIELD.SMALL_CLOCKS ?
													sortingOptions.sortingOrder : SORTING_ORDER.ASC}
												onClick={() => {
													handleRequestSort(SORTED_FIELD.SMALL_CLOCKS);
												}}
											>
											Small clock
												{sortingOptions.sortingField === SORTED_FIELD.SMALL_CLOCKS ? (
													<Box
														component="span"
														sx={visuallyHidden}
													/>
												) : null}
											</TableSortLabel>
										</StyledTableCell>
										<StyledTableCell sx={{width: '12%'}} align="center">
											<TableSortLabel
												active={sortingOptions.sortingField === SORTED_FIELD.MEDIUM_CLOCKS}
												direction={sortingOptions.sortingField === SORTED_FIELD.MEDIUM_CLOCKS ?
													sortingOptions.sortingOrder : SORTING_ORDER.ASC}
												onClick={() => {
													handleRequestSort(SORTED_FIELD.MEDIUM_CLOCKS);
												}}
											>
												Medium clock
												{sortingOptions.sortingField === SORTED_FIELD.MEDIUM_CLOCKS ? (
													<Box
														component="span"
														sx={visuallyHidden}
													/>
												) : null}
											</TableSortLabel>
										</StyledTableCell>
										<StyledTableCell sx={{width: '12%'}} align="center">
											<TableSortLabel
												active={sortingOptions.sortingField === SORTED_FIELD.LARGE_CLOCKS}
												direction={sortingOptions.sortingField === SORTED_FIELD.LARGE_CLOCKS ?
													sortingOptions.sortingOrder : SORTING_ORDER.ASC}
												onClick={() => {
													handleRequestSort(SORTED_FIELD.LARGE_CLOCKS);
												}}
											>
											Large clock
												{sortingOptions.sortingField === SORTED_FIELD.LARGE_CLOCKS ? (
													<Box
														component="span"
														sx={visuallyHidden}
													/>
												) : null}
											</TableSortLabel>
										</StyledTableCell>
										<StyledTableCell sx={{width: '12%'}} align="center">
											<TableSortLabel
												active={sortingOptions.sortingField === SORTED_FIELD.RATING}
												direction={sortingOptions.sortingField === SORTED_FIELD.RATING ?
													sortingOptions.sortingOrder : SORTING_ORDER.ASC}
												onClick={() => {
													handleRequestSort(SORTED_FIELD.RATING);
												}}
											>
												Rating
												{sortingOptions.sortingField === SORTED_FIELD.RATING ? (
													<Box
														component="span"
														sx={visuallyHidden}
													/>
												) : null}
											</TableSortLabel>
										</StyledTableCell>
										<StyledTableCell sx={{width: '12%'}} align="center">
											<TableSortLabel
												active={sortingOptions.sortingField === SORTED_FIELD.COMPLETED}
												direction={sortingOptions.sortingField === SORTED_FIELD.COMPLETED ?
													sortingOptions.sortingOrder : SORTING_ORDER.ASC}
												onClick={() => {
													handleRequestSort(SORTED_FIELD.COMPLETED);
												}}
											>
												Completed
												{sortingOptions.sortingField === SORTED_FIELD.COMPLETED ? (
													<Box
														component="span"
														sx={visuallyHidden}
													/>
												) : null}
											</TableSortLabel>
										</StyledTableCell>
										<StyledTableCell sx={{width: '12%'}} align="center">
											<TableSortLabel
												active={sortingOptions.sortingField === SORTED_FIELD.UNCOMPLETED}
												direction={sortingOptions.sortingField === SORTED_FIELD.UNCOMPLETED ?
													sortingOptions.sortingOrder : SORTING_ORDER.ASC}
												onClick={() => {
													handleRequestSort(SORTED_FIELD.UNCOMPLETED);
												}}
											>
												Uncompleted
												{sortingOptions.sortingField === SORTED_FIELD.UNCOMPLETED ? (
													<Box
														component="span"
														sx={visuallyHidden}
													/>
												) : null}
											</TableSortLabel>
										</StyledTableCell>
										<StyledTableCell sx={{width: '12%'}} align="center">
											<TableSortLabel
												active={sortingOptions.sortingField === SORTED_FIELD.EARNED_AMOUNT}
												direction={sortingOptions.sortingField === SORTED_FIELD.EARNED_AMOUNT ?
													sortingOptions.sortingOrder : SORTING_ORDER.ASC}
												onClick={() => {
													handleRequestSort(SORTED_FIELD.EARNED_AMOUNT);
												}}
											>
												Earned amount
												{sortingOptions.sortingField === SORTED_FIELD.EARNED_AMOUNT ? (
													<Box
														component="span"
														sx={visuallyHidden}
													/>
												) : null}
											</TableSortLabel>
										</StyledTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{mastersStatisticsData.map((master) => (
										<StyledTableRow key={master.id}>
											<StyledTableCell component="th" scope="row" align="center">
												{master.name}
											</StyledTableCell>
											<StyledTableCell align="center">{master.smallClocks || '-'}</StyledTableCell>
											<StyledTableCell align="center">{master.mediumClocks || '-'} </StyledTableCell>
											<StyledTableCell align="center">{master.largeClocks || '-'}</StyledTableCell>
											<StyledTableCell align="center">{master.rating}</StyledTableCell>
											<StyledTableCell align="center">{master.completed}</StyledTableCell>
											<StyledTableCell align="center">{master.uncompleted}</StyledTableCell>
											<StyledTableCell align="center">{`${master.earnedAmount * 10} $`}</StyledTableCell>
										</StyledTableRow>
									))}
								</TableBody>
								<TableFooter>
									<TableRow>
										<TablePagination
											rowsPerPageOptions={[5, 10, 25, {label: 'All', value: totalMasters}]}
											colSpan={8}
											count={totalMasters}
											rowsPerPage={mastersStatisticsLimit}
											page={mastersStatisticsPage}
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
					</Stack>
				</div>
			</LocalizationProvider>
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
	);
};

export default Statistics;
