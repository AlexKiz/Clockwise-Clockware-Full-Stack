import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './cities-list.module.css';
import {City} from '../../../../data/types/types';
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
} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import PrivateHeader from '../../../Headers/PrivateHeader';
import TablePaginationActions from '../../../Pagination/TablePaginationActions';


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
	const [notify, setNotify] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [totalCities, setTotalCities] = useState<number>(0);


	useEffect(()=> {
		const readCitiesData = async () => {
			const {data} = await axios.get<{count: number, rows: City[]}>(URL.CITY, {
				params: {
					limit: rowsPerPage,
					offset: rowsPerPage * page,
				},
			});
			setCities(data.rows);
			setTotalCities(data.count);
		};

		readCitiesData();
	}, [rowsPerPage, page]);


	const onDelete = (id: number) => {
		if (window.confirm('Do you want to delete this city?')) {
			axios.delete<City>(URL.CITY,
				{
					data: {id},
				}).then(() => {
				setCities(cities.filter((city) => city.id !== id));
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
				<TableContainer component={Paper} sx={{width: '40%'}} className={classes.conteiner_table}>
					<Table sx={{minWidth: 350}} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell sx={{width: '10%'}}>Id</StyledTableCell>
								<StyledTableCell sx={{width: '25%'}} align="center">Name</StyledTableCell>
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
									<StyledTableCell component="th" scope="row"> {city.id} </StyledTableCell>
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
						</TableFooter>
					</Table>
				</TableContainer>
				{
					notify &&
					<AlertMessage
						alertType='success'
						message='City has been deleted'
						isOpen={isOpen}
						notify={notify}
					/>
				}
			</div>
		</div>
	);
};

export default CitiesList;
