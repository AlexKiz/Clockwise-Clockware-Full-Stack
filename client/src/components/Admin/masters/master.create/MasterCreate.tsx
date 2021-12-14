/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import './master-create-form.css';
import {City, Master, Params} from '../../../../data/types/types';
import {MasterCreateProps} from './componentsConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';


const MasterCreate: FC<MasterCreateProps> = () => {
	const history = useHistory();

	const {masterIdParam, masterNameParam} = useParams<Params>();

	const [masterName, setMasterName] = useState<string>('');
	const [masterId, setMasterId]= useState<string>('');

	const [citiesId, setCitiesId] = useState<number[]>([]);
	const [cities, setCities] = useState<City[]>([]);


	useEffect(() => {
		const readMastersData = async () => {
			const {data} = await axios.get<Master[]>(URL.MASTER);

			if (masterIdParam && data.length) {
				const currentMaster = data.filter((master) => master.id === masterIdParam);

				if (currentMaster.length) {
					if (currentMaster[0].cities.length) {
						const currentMasterCities = currentMaster[0].cities.map((city) => {
							return city.id;
						});
						setMasterName( masterNameParam );
						setMasterId( masterIdParam );
						setCitiesId( currentMasterCities );
					} else {
						setMasterName( masterNameParam );
						setMasterId( masterIdParam );
					}
				}
			}
		};

		readMastersData();
	}, []);


	useEffect(() => {
		const readCitiesData = async () => {
			const {data} = await axios.get<City[]>(URL.CITY);

			if (data.length) {
				setCities(data);
			}
		};

		axios.post(URL.MASTER,
			{
				name: masterName,
				citiesId,
			}).then(() =>{
			setMasterName('');
			alert('Master has been created');
			history.push(`/${RESOURCE.ADMIN}/${RESOURCE.MASTERS_LIST}`);
		});
		readCitiesData();
	}, []);


	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!masterIdParam) {
			axios.post(URL.MASTER,
				{
					name: masterName,
					citiesId,
				}).then(() =>{
				setMasterName('');
				alert('Master has been created');
				history.push(`/${RESOURCE.ADMIN}/${RESOURCE.MASTERS_LIST}`);
			});
		} else {
			axios.put(URL.MASTER, {
				id: masterId,
				name: masterName,
				citiesId,
			}).then(() => {
				alert('Master has been updated');
				history.push(`/${RESOURCE.ADMIN}/${RESOURCE.MASTERS_LIST}`);
			});
		}
	};


	return (
		<div className='container-form'>

			<form className='form' onSubmit={onSubmit}>

				<div>

					<div className='form-section'>
						<div className='form-input__label'>
							<label>Enter master name:</label>
						</div>
						<input
							type='text'
							placeholder = 'Name Surname'
							pattern='^[A-Za-zА-Яа-я]{3,49}$|^[A-Za-zА-Яа-я]{3,49}[\s]{1}[A-Za-zА-Яа-я]{3,50}$'
							title='Master name must be at least 3 letter and alphabetical characters only'
							value={masterName}
							onChange={(masterNameEvent) => setMasterName(masterNameEvent.target.value)}
						>
						</input>
					</div>


					<div className='form-input__label'>
						<label>Choose master's сity:</label>
					</div>

					<div className='form-section_checkbox'>
						{
							cities.map((city) => (
								<div className='form-section_checkbox'>
									<div className='form-input_checkbox'>
										<input
											type="checkbox"
											value={city.id}
											checked={citiesId.includes(city.id)}
											onChange = {
												function(event) {
													if (event.target.checked) {
														setCitiesId([...citiesId, Number(event.target.value)]);
													} else {
														setCitiesId([...citiesId].filter((elem) => elem !== Number(event.target.value)));
													}
												}
											}
										/>
									</div>
									<div className='checkbox-label'>
										<span className='form-input_checkbox-name'>{city.name}</span>
									</div>
								</div>
							))
						}
					</div>

					<div className='form-button'>
						<button type='submit'>
                            Submit
						</button>
					</div>

				</div>

			</form>

		</div>
	);
};

export default MasterCreate;
