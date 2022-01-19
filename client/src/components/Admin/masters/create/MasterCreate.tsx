import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import classes from './master-create-form.module.css';
import {AlertNotification, City, Master, Params} from '../../../../data/types/types';
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
	Typography,
} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import {InputLabel} from '@mui/material';
import AdminHeader from '../../../Headers/AdminHeader';


const MasterCreate: FC<MasterCreateProps> = () => {
	const history = useHistory();

	const {masterIdParam, masterNameParam} = useParams<Params>();

	const [cities, setCities] = useState<City[]>([]);

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
			id: masterIdParam || '',
			name: masterNameParam || '',
			citiesId: [] as number[],
		},
		validate,
		onSubmit: async (values) => {
			if (!masterIdParam) {
				axios.post(URL.MASTER,
					{
						name: values.name,
						citiesId: values.citiesId,
					}).then(() =>{
					setAlertOptions({message: 'Master has been created', type: 'success', notify: true});
					history.push(`/${RESOURCE.ADMIN}/${RESOURCE.MASTERS_LIST}`);
				});
			} else {
				axios.put(URL.MASTER, {
					id: values.id,
					name: values.name,
					citiesId: values.citiesId,
				}).then(() => {
					setAlertOptions({message: 'Master has been updated', type: 'success', notify: true});
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
						formik.values.id = masterIdParam;
						formik.values.citiesId.push(...currentMasterCities);
					} else {
						formik.values.id = masterIdParam;
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
										Enter master name:
								</Typography>
							</div>
							<TextField
								id="name"
								name="name"
								label="Master name"
								placeholder="Full name"
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
							<div className={classes.form_input__label}>
								<Typography
									variant="h6"
									gutterBottom
									component="label"
								>
									Choose masters сity:
								</Typography>
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
											key={city.id}
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

export default MasterCreate;
