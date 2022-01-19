import axios from 'axios';
import React, {FC, useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import classes from './city-create-form.module.css';
import {AlertNotification, City, Params} from '../../../../data/types/types';
import {CityCreateProps, validate} from './componentConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';
import {useFormik} from 'formik';
import {
	Button,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import AdminHeader from '../../../Headers/PrivateHeader';


const CityCreate: FC<CityCreateProps> = () => {
	const history = useHistory();

	const {cityNameParam} = useParams<Params>();

	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});


	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	const formik = useFormik({
		initialValues: {
			name: cityNameParam || '',
			id: 0,
		},
		validate,
		onSubmit: async (values) => {
			if (!cityNameParam) {
				await axios.post<City>(URL.CITY,
					{
						name: values.name,
					}).then(() => {
					setAlertOptions({message: 'City has been created', type: 'success', notify: true});
					history.push(`/${RESOURCE.ADMIN}/${RESOURCE.CITIES_LIST}`);
				}).catch((error) => {
					if (Number(error.response.status) === 400) {
						setAlertOptions({message: error.response.data, type: 'error', notify: true});
						values.name = '';
					}
				});
			} else {
				await axios.put<City>(URL.CITY, {
					id: values.id,
					name: values.name,
				}).then(() => {
					setAlertOptions({message: 'City has been updated', type: 'success', notify: true});
					history.push(`/${RESOURCE.ADMIN}/${RESOURCE.CITIES_LIST}`);
				}).catch((error) => {
					setAlertOptions({message: error.response.data, type: 'error', notify: true});
					values.name = cityNameParam;
				});
			}
		},
	});


	useEffect(() => {
		const readCityForUpdate = async () => {
			const {data} = await axios.get<City>(URL.CITY_FOR_UPDATE, {
				params: {
					name: cityNameParam,
				},
			});

			formik.values.id = data.id;
		};

		readCityForUpdate();
	}, []);


	return (
		<div>
			<AdminHeader/>
			<div className={classes.container_form}>

				<form className={classes.form} onSubmit = {formik.handleSubmit}>

					<Stack direction="column" justifyContent="center" spacing={1.5}>
						<div className={classes.form_section}>
							<div className={classes.form_input__label}>
								<Typography
									variant="h6"
									gutterBottom
									component="label"
								>
									Enter city name:
								</Typography>
							</div>
							<TextField
								id="name"
								name="name"
								label="City name"
								placeholder="Name"
								variant="filled"
								size="small"
								margin="dense"
								fullWidth
								value={formik.values.name}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.name && Boolean(formik.errors.name)}
								helperText={formik.touched.name && formik.errors.name}
								required
							/>
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
					alertOptions.notify &&
					<AlertMessage
						alertType={alertOptions.type}
						message={alertOptions.message}
						isOpen={isOpen}
						notify={alertOptions.notify}
					/>
				}
			</div>

		</div>
	);
};

export default CityCreate;
