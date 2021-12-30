import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './masters-list.module.css';
import {Master} from '../../../../data/types/types';
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
} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import PrivateHeader from 'src/components/Headers/PrivateHeader';
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

const MastersList: FC<MasterListProps> = () => {
	const [masters, setMasters] = useState<Master[]>([]);

	const [notify, setNotify] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [totalMasters, setTotalMasters] = useState<number>(0);


	useEffect(() => {
		const readMastersData = async () => {
			const {data} = await axios.get<{count: number, rows: Master[]}>(URL.MASTER, {
				params: {
					limit: rowsPerPage,
					offset: rowsPerPage * page,
				},
			});
			setMasters(data.rows);
			setTotalMasters(data.count);
		};

		readMastersData();
	}, [rowsPerPage, page]);


	const onDelete = (id: string) => {
		if (window.confirm('Do you want to delete this master?')) {
			axios.delete(URL.MASTER,
				{
					data: {
						id,
					},
				}).then(() => {
				setMasters(masters.filter((master) => master.id !== id));
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
				<TableContainer component={Paper} sx={{width: '80%'}} className={classes.conteiner_table}>
					<Table sx={{minWidth: 350}} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell sx={{width: '10%'}}>Id</StyledTableCell>
								<StyledTableCell sx={{width: '20%'}} align="center">Master name</StyledTableCell>
								<StyledTableCell sx={{width: '25%'}} align="center">Cities</StyledTableCell>
								<StyledTableCell sx={{width: '25%'}} align="center">Rating</StyledTableCell>
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
						</TableFooter>
					</Table>
				</TableContainer>
				{
					notify && <AlertMessage alertType='success' message='Master has been deleted' isOpen={isOpen} notify={notify}/>
				}
			</div>
		</div>
	);
};

export default MastersList;
