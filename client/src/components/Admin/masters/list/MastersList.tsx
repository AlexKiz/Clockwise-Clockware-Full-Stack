import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './masters-list.module.css';
import {AlertNotification, Master} from '../../../../data/types/types';
import {MasterListProps} from './componentConstants';
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
	LinearProgress,
	Typography,
} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import PrivateHeader from 'src/components/Headers/PrivateHeader';
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


const MastersList: FC<MasterListProps> = () => {
	const [masters, setMasters] = useState<Master[]>([]);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [totalMasters, setTotalMasters] = useState<number>(0);
	const [sortedField, setSortField] = useState<string>('id');
	const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('asc');
	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});
	const [loading, setLoading] = useState<boolean>(false);


	useEffect(() => {
		const readMastersData = async () => {
			setLoading(true);
			await axios.get<{count: number, rows: Master[]}>(URL.MASTER, {
				params: {
					limit: rowsPerPage,
					offset: rowsPerPage * page,
					sortedField,
					sortingOrder,
				},
			}).then((response) => {
				setMasters(response.data.rows);
				setTotalMasters(response.data.count);
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

		readMastersData();
	}, [rowsPerPage, page, sortedField, sortingOrder]);


	const onDelete = (id: string) => {
		if (window.confirm('Do you want to delete this master?')) {
			axios.delete(URL.MASTER,
				{
					data: {
						id,
					},
				}).then(() => {
				setMasters(masters.filter((master) => master.id !== id));
				setAlertOptions({
					type: 'success',
					message: 'Master has been deleted!',
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


	return (
		<div>
			<PrivateHeader/>
			<div className={classes.conteiner}>
				<TableContainer component={Paper} sx={{width: '80%'}} className={classes.conteiner_table}>
					<Table sx={{minWidth: 350}} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell sx={{width: '10%'}}>
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
								<StyledTableCell sx={{width: '20%'}} align="center">
									<TableSortLabel
										active={sortedField === 'name' ? true : false}
										direction={sortedField === 'name' ? sortingOrder : 'asc'}
										onClick={() => {
											handleRequestSort('name');
										}}
									>
										Master name
										{sortedField === 'name' ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '25%'}} align="center">Cities</StyledTableCell>
								<StyledTableCell sx={{width: '25%'}} align="center">
									<TableSortLabel
										active={sortedField === 'rating' ? true : false}
										direction={sortedField === 'rating' ? sortingOrder : 'asc'}
										onClick={() => {
											handleRequestSort('rating');
										}}
									>
										Rating
										{sortedField === 'rating' ? (
											<Box
												component="span"
												sx={visuallyHidden}
											/>
										) : null}
									</TableSortLabel>
								</StyledTableCell>
								<StyledTableCell sx={{width: '20%'}} align="center">
									<Link to={`/${RESOURCE.ADMIN}/${RESOURCE.MASTER_CREATE}`}>
										<Button
											variant="contained"
											sx={{width: '100%', fontSize: 14, borderRadius: 15}}
											color='success'
										>
											Create master
										</Button>
									</Link>
								</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{masters.map((master) => (
								<StyledTableRow key={master.id}>
									<StyledTableCell component="th" scope="row"> {master.id.slice(0, 4)} </StyledTableCell>
									<StyledTableCell align="center"> {master.name} </StyledTableCell>
									<StyledTableCell align="center">
										{master.cities.map((city) => {
											return `${city.name}`;
										}).join(', ')}
									</StyledTableCell>
									<StyledTableCell align="center"> {master.rating.toFixed(2)} </StyledTableCell>
									<StyledTableCell align="center">
										<Link to={`/${RESOURCE.ADMIN}/${RESOURCE.MASTER_CREATE}/${master.id}/${master.name}`}>
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
												onDelete(master.id);
											}}
										>
											Delete
										</Button>
									</StyledTableCell>
								</StyledTableRow>
							))}
							{ !masters.length &&
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
									rowsPerPageOptions={[5, 10, 25, {label: 'All', value: totalMasters}]}
									colSpan={5}
									count={totalMasters}
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
								{ loading && <TableCell colSpan={5}>
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

export default MastersList;
