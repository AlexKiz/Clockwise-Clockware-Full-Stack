/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
import axios from 'axios';
import React, {useEffect, FC} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import classes from './verification.module.css';
import {URL} from '../../../../data/constants/routeConstants';
import {Params} from 'src/data/types/types';
import {Button, Stack} from '@mui/material';
import {VerificationProps} from './componentConstants';


const Verification: FC<VerificationProps> = () => {
	const history = useHistory();

	const {hashVerify} = useParams<Params>();

	useEffect(() => {
		const verifyUser = async () => {
			await axios.put(URL.VERIFY, {
				hashVerify,
			}).then((response) => {
				const [isUserVerified] = response.data;
				if (!isUserVerified) {
					history.push(URL.LOGIN);
				}
			});
		};

		verifyUser();
	}, []);


	const handleOnClick = () => {
		history.push(URL.LOGIN);
	};

	return (
		<div>

			<div className={classes.container}>
				<div className={classes.container_notification}>
					<Stack direction='column' justifyContent='center' spacing={2}>
						<div className={classes.form_label}>
							<label>CONGRATULATIONS! You have verified your email!</label>
						</div>

						<div className={classes.form_section}>
							<Button
								variant="contained"
								onClick={handleOnClick}
								className={classes.btn}
								style={ {fontSize: 22, backgroundColor: 'green', borderRadius: 15} }
							>
								GO TO MAIN PAGE
							</Button>
						</div>
					</Stack>
				</div>
			</div>

		</div>
	);
};

export default Verification;
