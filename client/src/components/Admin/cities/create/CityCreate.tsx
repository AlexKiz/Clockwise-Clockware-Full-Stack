import axios from 'axios';
import React, {FC, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import classes from './city-create-form.module.css';
import {City, Params} from '../../../../data/types/types';
import {CityCreateProps, validate} from './componentConstants';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';
import {useFormik} from 'formik';
import {Button, Stack, TextField, AlertColor} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';


const CityCreate: FC<CityCreateProps> = () => {
	const history = useHistory();

	const {cityIdParam, cityNameParam} = useParams<Params>();

	const [notify, setNotify] = useState<boolean>(false);
	const [alertType, setAlertType] = useState<AlertColor>('success');
	const [message, setMessage] = useState<string>('');

	const isOpen = (value:boolean) => {
		setNotify(value);
	};

	const formik = useFormik({
		initialValues: {
			cityName: cityNameParam || '',
			cityId: Number(cityIdParam || 0),
		},
		validate,
		onSubmit: async (values) => {
			if (!cityIdParam) {
				await axios.post<City>(URL.CITY,
					{
						id: values.cityId,
						name: values.cityName,
					}).then(() => {
					setMessage('City has been created');
					setAlertType('success');
					setNotify(true);
					history.push(`/${RESOURCE.ADMIN}/${RESOURCE.CITIES_LIST}`);
				}).catch((error) => {
					if (Number(error.response.status) === 400) {
						alert(error.response.data[0]);
						values.cityName = '';
					}
				});
			} else {
				await axios.put<City>(URL.CITY, {
					id: values.cityId,
					name: values.cityName,
				}).then(() => {
					setMessage('City has been updated');
					setAlertType('success');
					setNotify(true);
					history.push(`/${RESOURCE.ADMIN}/${RESOURCE.CITIES_LIST}`);
				}).catch((error) => {
					setMessage(error.response.data);
					setAlertType('error');
					setNotify(true);
					values.cityName = cityNameParam;
				});
			}
		},
	});


	return (
		<div>

			<div className={classes.container_form}>

				<form className={classes.form} onSubmit = {formik.handleSubmit}>

					<Stack direction="column" justifyContent="center" spacing={1.5}>
						<div className={classes.form_section}>
							<div className={classes.form_input__label}>
								<label>Enter city name:</label>
							</div>
							<TextField
								id="cityName"
								name="cityName"
								label="City name"
								placeholder="Name"
								variant="filled"
								size="small"
								margin="dense"
								fullWidth
								value={formik.values.cityName}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.cityName && Boolean(formik.errors.cityName)}
								helperText={formik.touched.cityName && formik.errors.cityName}
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
					notify ? <AlertMessage alertType={alertType} message={message} isOpen={isOpen} notify={notify}/> : ''
				}
			</div>

		</div>
	);
};

export default CityCreate;
