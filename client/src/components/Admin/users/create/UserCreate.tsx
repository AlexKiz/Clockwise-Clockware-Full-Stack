/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import axios from 'axios';
import React, {useState, FC} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import classes from './user-create-form.module.css';
import {Params} from '../../../../data/types/types';
import {UserCreateProps, validate} from './componentConstant';
import {RESOURCE, URL} from '../../../../data/constants/routeConstants';
import {useFormik} from 'formik';
import {Button, Stack, TextField, AlertColor} from '@mui/material';
import AlertMessage from 'src/components/Notification/AlertMessage';


const UserCreate: FC<UserCreateProps> = () => {
	const history = useHistory();

	const {userIdParam, userNameParam, userEmailParam} = useParams<Params>();

	const [notify, setNotify] = useState<boolean>(false);
	const [alertType, setAlertType] = useState<AlertColor>('success');
	const [message, setMessage] = useState<string>('');

	const isOpen = (value:boolean) => {
		setNotify(value);
	};

	const formik = useFormik({
		initialValues: {
			userName: userNameParam,
			userId: userIdParam,
			userEmail: userEmailParam,
		},
		validate,
		onSubmit: async (values) => {
			await axios.put(URL.USER,
				{
					id: values.userId,
					name: values.userName,
					email: values.userEmail,
				}).then(() => {
				setMessage('User has been updated');
				setAlertType('success');
				setNotify(true);
				history.push(`/${RESOURCE.ADMIN}/${RESOURCE.USERS_LIST}`);
			}).catch(() => {
				setMessage('User with current email already exists');
				setAlertType('error');
				setNotify(true);
				values.userEmail = userEmailParam;
			});
		},
	});


	return (
		<div>

			<div className={classes.container_form}>

				<form className={classes.form} onSubmit = {formik.handleSubmit}>

					<Stack direction="column" justifyContent="center" spacing={1.5}>
						<div className={classes.form_section}>
							<div className={classes.form_input__label}>
								<label>Enter User name:</label>
							</div>
							<TextField
								id="userName"
								name="userName"
								label="User name"
								placeholder="Name"
								variant="filled"
								size="small"
								margin="dense"
								fullWidth
								value={formik.values.userName}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.userName && Boolean(formik.errors.userName)}
								helperText={formik.touched.userName && formik.errors.userName}
								required
							/>
						</div>

						<div className={classes.form_section}>
							<div className={classes.form_input__label}>
								<label>Enter User's email:</label>
							</div>
							<TextField
								id="userEmail"
								name="userEmail"
								label="Email"
								placeholder="Email"
								variant="filled"
								size="small"
								margin="dense"
								fullWidth
								value={formik.values.userEmail}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.userEmail && Boolean(formik.errors.userEmail)}
								helperText={formik.touched.userEmail && formik.errors.userEmail}
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

export default UserCreate;
