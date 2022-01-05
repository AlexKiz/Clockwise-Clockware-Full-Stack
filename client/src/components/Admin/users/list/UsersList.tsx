/* eslint-disable react/jsx-key */
/* eslint-disable max-len */
import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './user-list.module.css';
import {User} from '../../../../data/types/types';
import {UserListProps} from './componentConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';
import {styled} from '@mui/material/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, tableCellClasses} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';

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

	const isOpen = (value:boolean) => {
		setNotify(value);
	};


	useEffect(() => {
		const readUsersData = async () => {
			const {data} = await axios.get<User[]>(URL.USER);

			setUsers(data);
		};

		readUsersData();
	}, []);


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


	return (

		<div className={classes.conteiner}>

			<TableContainer component={Paper} sx={{width: 4/7}} className={classes.conteiner_table}>

				<Table sx={{minWidth: 350}} aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell sx={{width: 1/10}}>Id</StyledTableCell>
							<StyledTableCell sx={{width: 1/5}} align="center">User name</StyledTableCell>
							<StyledTableCell sx={{width: 1/4}} align="center">Email</StyledTableCell>
							<StyledTableCell sx={{width: 2/7}} align="center"></StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<StyledTableRow>

								<StyledTableCell component="th" scope="row"> {user.id.slice(0, 4)} </StyledTableCell>

								<StyledTableCell align="center"> {user.name} </StyledTableCell>

								<StyledTableCell align="center"> {user.email} </StyledTableCell>

								<StyledTableCell align="center">
									<Link to={`/${RESOURCE.ADMIN}/${RESOURCE.USER_CREATE}/${user.id}/${user.name}/${user.email}`}>
										<Button
											variant="contained"
											sx={{width: 1/2, fontSize: 14, borderRadius: 15}}
										>
											Update
										</Button>
									</Link>
									<Button
										variant="contained"
										color='error'
										sx={{width: 1/2, fontSize: 14, borderRadius: 15}}
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
				</Table>

			</TableContainer>
			{
				notify && <AlertMessage alertType='success' message='User has been deleted' isOpen={isOpen} notify={notify}/>
			}
		</div>
	);
};

export default UserList;
