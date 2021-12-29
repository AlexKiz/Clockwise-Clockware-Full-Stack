import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import './city-create-form.css';
import {City, Params} from '../../../../data/types/types';
import {CityCreateProps} from './componentConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';


const CityCreate: FC<CityCreateProps> = () => {
	const history = useHistory();

	const [cityName, setCityName] = useState<string>('');
	const [cityId, setCityId] = useState<number>(0);

	const {cityIdParam, cityNameParam} = useParams<Params>();


	useEffect(() => {
		if (cityIdParam) {
			setCityId(Number(cityIdParam));
			setCityName(cityNameParam);
		}
	}, []);


	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!cityIdParam) {
			axios.post<City>(URL.CITY,
				{
					id: cityId,
					name: cityName,
				}).then(() => {
				alert('City has been created');
				history.push(`/${RESOURCE.ADMIN}/${RESOURCE.CITIES_LIST}`);
			}).catch((error) => {
				if (Number(error.response.status) === 400) {
					alert(error.response.data[0]);
					setCityName('');
				}
			});
		} else {
			axios.put<City>(URL.CITY, {
				id: cityId,
				name: cityName,
			}).then(() => {
				alert('City has been updated');
				history.push(`/${RESOURCE.ADMIN}/${RESOURCE.CITIES_LIST}`);
			}).catch((error) => {
				alert(error.response.data);
				setCityName(cityNameParam);
			});
		}
	};

	return (

		<div className='container-form'>

			<form className='form' onSubmit = {onSubmit}>

				<div>

					<div className='form-section'>
						<div className='form-input__label'>
							<label>Enter city name:</label>
						</div>
						<input
							type = "text"
							placeholder = "Name"
							pattern='^[A-Za-zА-Яа-я]{3,100}$|^[A-Za-zА-Яа-я]{3,49}[-\s]{1}[A-Za-zА-Яа-я]{3,50}$'
							title='City name must be at least 3 letter and alphabetical only'
							value = {cityName}
							onChange = {(cityNameEvent) =>setCityName(cityNameEvent.target.value)}
						></input>
					</div>

					<div className='form-button'>
						<button type = 'submit'>Submit</button>
					</div>

				</div>

			</form>
		</div>
	);
};

export default CityCreate;
