/* eslint-disable react/jsx-key */
/* eslint-disable max-len */
import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import './cities-list.css';
import {City} from '../../../../data/types/types';
import {CitiesListProps} from './componentConstants';
import {URL, RESOURCE} from '../../../../data/constants/routeConstants';


const CitiesList: FC<CitiesListProps> = () => {
	const [cities, setCities] = useState<City[]>([]);


	useEffect(()=> {
		const readCitiesData = async () => {
			const {data} = await axios.get<City[]>(URL.CITY);

			setCities(data);
		};

		readCitiesData();
	}, []);


	const onDelete = (id: number) => {
		if (window.confirm('Do you want to delete this city?')) {
			axios.delete<City>(URL.CITY,
				{
					data: {id},
				}).then(() => {
				setCities(cities.filter((city) => city.id !== id));

				alert('City has been deleted');
			});
		}
	};


	return (

		<div className='conteiner'>

			<div className='wrapper-table'>

				<table className='content-table-cities'>
					<tr>
						<th className='th-city-id'>Id</th>
						<th className='th-city-name'>City name</th>
						<button className='button-add'><Link to = {`/${RESOURCE.ADMIN}/${RESOURCE.CITY_CREATE}`}>Create new city</Link></button>
					</tr>
					{
						cities.map((city) => (
							<tr>
								<td>{`${city.id}`}</td>
								<td>{`${city.name}`}</td>
								<button className='button-update'><Link to = {`/${RESOURCE.ADMIN}/${RESOURCE.CITY_CREATE}/${city.id}/${city.name}`}>Update</Link></button>
								<button className='button-delete' onClick = {() => {
									onDelete(city.id);
								}}>Delete</button>
							</tr>
						))
					}
				</table>

			</div>

		</div>
	);
};

export default CitiesList;
