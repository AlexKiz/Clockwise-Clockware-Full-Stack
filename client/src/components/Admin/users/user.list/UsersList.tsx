/* eslint-disable react/jsx-key */
/* eslint-disable max-len */
import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
<<<<<<<< HEAD:client/src/components/Admin/users/list/UsersList.tsx
import './user-list.css';
========
import '../user.list/user-list.css';
>>>>>>>> d3f3e75 (fixed according comments):client/src/components/Admin/users/user.list/UsersList.tsx
import {User} from '../../../../data/types/types';
import {UserListProps} from './componentConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';


const UserList: FC<UserListProps> = () => {
	const [users, setUsers] = useState<User[]>([]);

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

				alert('User has been deleted');
			});
		}
	};


	return (

		<div className='conteiner'>

			<div className='wrapper-table'>

				<table className='content-table-users'>
					<tr>
						<th className='th-user-id'>Id</th>
						<th className='th-user-name'>User name</th>
						<th className='th-email'>Email</th>
					</tr>
					{
						users.map((user) => (
							<tr>
								<td>{`${user.id}`}</td>
								<td>{`${user.name}`}</td>
								<td>{`${user.email}`}</td>
								<button className='button-update'><Link to={`/${RESOURCE.ADMIN}/${RESOURCE.USER_CREATE}/${user.id}/${user.name}/${user.email}`}>Update</Link></button>
								<button className='button-delete' onClick ={() => onDelete(user.id)}>Delete</button>
							</tr>
						))
					}
				</table>
			</div>

		</div>
	);
};

export default UserList;
