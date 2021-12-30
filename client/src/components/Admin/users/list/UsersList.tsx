import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './user-list.module.css';
import {User} from '../../../../data/types/types';
import {UserListProps} from './componentConstants';
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


const UserList: FC<UserListProps> = () => {
	const [users, setUsers] = useState<User[]>([]);

	const [notify, setNotify] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(5);
	const [totalUsers, setTotalUsers] = useState<number>(0);


	useEffect(() => {
		const readUsersData = async () => {
			const {data} = await axios.get<{count: number, rows:User[]}>(URL.USER, {
				params: {
					limit: rowsPerPage,
					offset: rowsPerPage * page,
				},
			});
			setUsers(data.rows);
			setTotalUsers(data.count);
		};

		readUsersData();
	}, [rowsPerPage, page]);


	const onDelete = (id: string) => {
		if (window.confirm('Do you want to delete this user?')) {
			axios.delete(URL.USER,
				{
					data: {
						id,
					},
				}).then(() => {
				setUsers(users.filter((user) => user.id !== id));
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
				<TableContainer component={Paper} sx={{width: '57%'}} className={classes.conteiner_table}>
					<Table sx={{minWidth: 350}} aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell sx={{width: '10%'}}>Id</StyledTableCell>
								<StyledTableCell sx={{width: '25%'}} align="center">User name</StyledTableCell>
								<StyledTableCell sx={{width: '30%'}} align="center">Email</StyledTableCell>
								<StyledTableCell sx={{width: '35%'}} align="center"></StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<StyledTableRow key={user.id}>
									<StyledTableCell component="th" scope="row"> {user.id.slice(0, 4)} </StyledTableCell>
									<StyledTableCell align="center"> {user.name} </StyledTableCell>
									<StyledTableCell align="center"> {user.email} </StyledTableCell>
									<StyledTableCell align="center">
										<Link to={`/${RESOURCE.ADMIN}/${RESOURCE.USER_CREATE}/${user.id}/${user.name}/${user.email}`}>
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
												onDelete(user.id);
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
									rowsPerPageOptions={[5, 10, 25, {label: 'All', value: totalUsers}]}
									colSpan={5}
									count={totalUsers}
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
						message='User has been deleted'
						isOpen={isOpen}
						notify={notify}
					/>
				}
			</div>
		</div>
	);
};

export default UserList;
