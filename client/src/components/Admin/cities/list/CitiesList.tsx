import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './cities-list.module.css';
import {AlertNotification, City} from '../../../../data/types/types';
import {CitiesListProps} from './componentConstants';
import {URL, RESOURCE} from '../../../../data/constants/routeConstants';
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
	LinearProgress,
	Typography,
} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import PrivateHeader from '../../../Headers/PrivateHeader';
import TablePaginationActions from '../../../Pagination/TablePaginationActions';
import {visuallyHidden} from '@mui/utils';
import {SORTED_FIELD, SORTING_ORDER} from 'src/data/constants/systemConstants';


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

const CitiesList: FC<CitiesListProps> = () => {
	const [cities, setCities] = useState<City[]>([]);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [totalCities, setTotalCities] = useState<number>(0);
	const [sortedField, setSortField] = useState<string>('id');
	const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('asc');
	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});
	const [loading, setLoading] = useState<boolean>(false);


	useEffect(()=> {
		const readCitiesData = async () => {
			setLoading(true);
			axios.get<{count: number, rows: City[]}>(URL.CITY, {
				params: {
					limit: rowsPerPage,
					offset: rowsPerPage * page,
					sortedField,
					sortingOrder,
				},
			}).then((response) => {
				setCities(response.data.rows);
				setTotalCities(response.data.count);
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

		readCitiesData();
	}, [rowsPerPage, page, sortedField, sortingOrder]);


	const onDelete = (id: number) => {
		if (window.confirm('Do you want to delete this city?')) {
			axios.delete<City>(URL.CITY,
				{
					data: {id},
				}).then(() => {
				setCities(cities.filter((city) => city.id !== id));
				setAlertOptions({
					type: 'success',
					message: 'City has been deleted!',
					notify: true,
				});
			}).catch((error) => {
				if (error.message.includes('status code 405')) {
					setAlertOptions({
						type: 'error',
						message: 'City belongs to order and could not be deleted!',
						notify: true,
					});
				}
			});
		}
	};

	const isOpen = (value: boolean) => {
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

	return (
		<div>
			<PrivateHeader/>
			<div className={classes.conteiner}>
				<TableContainer component={Paper} sx={{width: '40%'}} className={classes.conteiner_table}>
					<Table sx={{minWidth: 350}} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell sx={{width: '10%'}}>
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
								<StyledTableCell sx={{width: '25%'}} align="center">
									<TableSortLabel
										active={sortedField === SORTED_FIELD.NAME}
										direction={sortedField === SORTED_FIELD.NAME ? sortingOrder : SORTING_ORDER.ASC}
										onClick={() => {
											handleRequestSort(SORTED_FIELD.NAME);
										}}
									>
										Name
										{sortedField === SORTED_FIELD.NAME ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '30%'}} align="center">
									<Link to={`/${RESOURCE.ADMIN}/${RESOURCE.CITY_CREATE}`}>
										<Button
											variant="contained"
											sx={{width: `100%`, fontSize: 14, borderRadius: 15}}
											color='success'
										>
											Create city
										</Button>
									</Link>
								</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{cities.map((city) => (
								<StyledTableRow key={city.id}>
									<StyledTableCell component="th" scope="row">{city.id}</StyledTableCell>
									<StyledTableCell align="center"> {city.name} </StyledTableCell>
									<StyledTableCell align="center">
										<Link to={`/${RESOURCE.ADMIN}/${RESOURCE.CITY_CREATE}/${city.name}`}>
											<Button
												variant="contained"
												sx={{width: '50%', fontSize: 14, borderRadius: 15}}
											>
												Update
											</Button>
										</Link>
										<Button
											variant="contained"
											color='error'
											sx={{width: '50%', fontSize: 14, borderRadius: 15}}
											onClick={() => {
												onDelete(city.id);
											}}
										>
											Delete
										</Button>
									</StyledTableCell>
								</StyledTableRow>
							))}
							{ !cities.length &&
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
									rowsPerPageOptions={[5, 10, 25, {label: 'All', value: totalCities}]}
									colSpan={3}
									count={totalCities}
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
								{ loading && <TableCell colSpan={3}>
									<LinearProgress />
								</TableCell>}
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
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

export default CitiesList;
