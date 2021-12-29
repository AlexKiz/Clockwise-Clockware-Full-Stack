/* eslint-disable react/jsx-key */
/* eslint-disable max-len */
import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import './masters-list.css';
import {Master} from '../../../../data/types/types';
import {MasterListProps} from './componentConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';


const MastersList: FC<MasterListProps> = () => {
	const [masters, setMasters] = useState<Master[]>([]);


	useEffect(() => {
		const readMastersData = async () => {
			const {data} = await axios.get<Master[]>(URL.MASTER);

			setMasters(data);
		};

		readMastersData();
	}, []);


	const onDelete = (id: string) => {
		if (window.confirm('Do you want to delete this master?')) {
			axios.delete(URL.MASTER,
				{
					data: {
						id,
					},
				}).then(() => {
				setMasters(masters.filter((master) => master.id !== id));

				alert('Master has been deleted');
			});
		}
	};


	return (
		<div className='conteiner'>

			<div className='wrapper-table'>

				<table className='content-table-masters'>
					<tr>
						<th className='th-master-id'>Id</th>
						<th className='th-master-name'>Master name</th>
						<th className='th-master-city'>Cities</th>
						<th className='th-rating'>Rating</th>
						<button className='button-add'><Link to={`/${RESOURCE.ADMIN}/${RESOURCE.MASTER_CREATE}`}>Create new master</Link></button>
					</tr>
					{
						masters.map((master) => (
							<tr>
								<td>{`${master.id}`}</td>
								<td>{`${master.name}`}</td>
								<td>{master.cities.map((city) => {
									return `${city.name}`;
								}).join(', ')}</td>
								<td>{`${master.rating}`}</td>
								<button className='button-update'><Link to={`/${RESOURCE.ADMIN}/${RESOURCE.MASTER_CREATE}/${master.id}/${master.name}`}>Update</Link></button>
								<button className='button-delete' onClick = {() => onDelete(master.id)}>Delete</button>
							</tr>

						))
					}
				</table>

			</div>

		</div>
	);
};

export default MastersList;
