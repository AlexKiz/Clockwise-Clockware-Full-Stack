/* eslint-disable require-jsdoc */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import classes from './master-create-form.module.css';
import {City, Master, Params} from '../../../../data/types/types';
import {MasterCreateProps, validate} from './componentsConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';
import {useFormik} from 'formik';
import {
	Button,
	Stack,
	TextField,
	Select,
	MenuItem,
	FormControl,
	OutlinedInput,
	FormHelperText,
	AlertColor,
} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import {InputLabel} from '@mui/material';


const MasterCreate: FC<MasterCreateProps> = () => {
	const history = useHistory();

	const {masterIdParam, masterNameParam} = useParams<Params>();

	const [cities, setCities] = useState<City[]>([]);

	const [notify, setNotify] = useState<boolean>(false);
	const [alertType, setAlertType] = useState<AlertColor>('success');
	const [message, setMessage] = useState<string>('');

	const isOpen = (value:boolean) => {
		setNotify(value);
	};

	const formik = useFormik({
		initialValues: {
			masterId: masterIdParam || '',
			masterName: masterNameParam || '',
			citiesId: [] as number[],
		},
		validate,
		onSubmit: async (values) => {
			if (!masterIdParam) {
				axios.post(URL.MASTER,
					{
						name: values.masterName,
						citiesId: values.citiesId,
					}).then(() =>{
					setMessage('Master has been created');
					setAlertType('success');
					setNotify(true);
					history.push(`/${RESOURCE.ADMIN}/${RESOURCE.MASTERS_LIST}`);
				});
			} else {
				axios.put(URL.MASTER, {
					id: values.masterId,
					name: values.masterName,
					citiesId: values.citiesId,
				}).then(() => {
					setMessage('Master has been updated');
					setAlertType('success');
					setNotify(true);
					history.push(`/${RESOURCE.ADMIN}/${RESOURCE.MASTERS_LIST}`);
				});
			}
		},
	});

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
						formik.values.masterId = masterIdParam;
						formik.values.citiesId.push(...currentMasterCities);
					} else {
						formik.values.masterId = masterIdParam;
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

		readCitiesData();
	}, []);


	return (
		<div>

			<div className={classes.container_form}>

				<form className={classes.form} onSubmit = {formik.handleSubmit}>

					<Stack direction="column" justifyContent="center" spacing={1.5}>
						<div className={classes.form_section}>
							<div className={classes.form_input__label}>
								<label>Enter master name:</label>
							</div>
							<TextField
								id="masterName"
								name="masterName"
								label="Master name"
								placeholder="Full name"
								variant="filled"
								size="small"
								margin="dense"
								fullWidth
								value={formik.values.masterName}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.masterName && Boolean(formik.errors.masterName)}
								helperText={formik.touched.masterName && formik.errors.masterName}
								required
							/>
						</div>

						<div className={classes.form_section}>
							<div className={classes.form_input__label}>
								<label>Choose master's сity:</label>
							</div>

							<FormControl
								fullWidth
								error={formik.touched.citiesId && Boolean(formik.errors.citiesId)}
							>
								<InputLabel id="cities">Cities</InputLabel>
								<Select
									id='citiesId'
									name='citiesId'
									labelId='cities'
									displayEmpty
									multiple
									onChange={formik.handleChange}
									value={formik.values.citiesId}
									onBlur={formik.handleBlur}
									input={<OutlinedInput label="Cities" />}
								>
									{cities.map((city) => (
										<MenuItem
											value={city.id}
										>
											{city.name}
										</MenuItem>
									))}
								</Select>
								<FormHelperText> {formik.touched.citiesId && formik.errors.citiesId} </FormHelperText>
							</FormControl>
						</div>

						<div className={classes.form_section}>
							<Button
								variant="contained"
								type="submit"
								className={classes.form_btn}
								style={ {fontSize: 18, backgroundColor: 'green', borderRadius: 15} }
							>
								Submit
							</Button>
						</div>
					</Stack>

				</form>
				{
					notify ? <AlertMessage alertType={alertType} message={message} isOpen={isOpen} notify={notify}/> : ''
				}
			</div>

		</div>
	);
};

export default MasterCreate;
