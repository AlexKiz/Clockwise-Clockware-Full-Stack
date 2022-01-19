import axios from 'axios';
import React, {useState, FC} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import classes from './user-create-form.module.css';
import {AlertNotification, Params} from '../../../../data/types/types';
import {UserCreateProps, validate} from './componentConstant';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';
import {useFormik} from 'formik';
import {
	Button,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';
import AdminHeader from '../../../Headers/AdminHeader';


const UserCreate: FC<UserCreateProps> = () => {
	const history = useHistory();

	const {userIdParam, userNameParam, userEmailParam} = useParams<Params>();

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
			name: userNameParam,
			id: userIdParam,
			email: userEmailParam,
		},
		validate,
		onSubmit: async (values) => {
			await axios.put(URL.USER,
				{
					id: values.id,
					name: values.name,
					email: values.email,
				}).then(() => {
				setAlertOptions({message: 'User has been updated', type: 'success', notify: true});
				history.push(`/${RESOURCE.ADMIN}/${RESOURCE.USERS_LIST}`);
			}).catch(() => {
				setAlertOptions({message: 'User with current email already exists', type: 'error', notify: true});
				values.email = userEmailParam;
			});
		},
	});


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
									Enter User name:
								</Typography>
							</div>
							<TextField
								id="name"
								name="name"
								label="User name"
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
							<div className={classes.form_input__label}>
								<Typography
									variant="h6"
									gutterBottom
									component="label"
								>
									Enter User email:
								</Typography>
							</div>
							<TextField
								id="email"
								name="email"
								label="Email"
								placeholder="Email"
								variant="filled"
								size="small"
								margin="dense"
								fullWidth
								value={formik.values.email}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.email && Boolean(formik.errors.email)}
								helperText={formik.touched.email && formik.errors.email}
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

export default UserCreate;
