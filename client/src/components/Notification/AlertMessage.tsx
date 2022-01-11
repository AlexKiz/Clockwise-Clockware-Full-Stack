import React, {useState, FC, useEffect} from 'react';
import {Alert, IconButton, Snackbar} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {AlertProps} from './componentConstants';


const AlertMessage: FC<AlertProps> = (props) => {
	const [open, setOpen] = useState<boolean>(true);

	useEffect(() => {
		setOpen(props.notify);
	});

	return (
		<Snackbar
			anchorOrigin={{vertical: 'top', horizontal: 'right'}}
			open={open}
			autoHideDuration={6000}
			onClose={()=>{
				setOpen(false);
				props.isOpen(false);
			}}
		>
			<Alert
				severity={props.alertType}
				action={
					<IconButton
						aria-label="close"
						color="inherit"
						size="small"
						onClick={() => {
							setOpen(false);
							props.isOpen(false);
						}}
					>
						<CloseIcon fontSize="inherit" />
					</IconButton>
				}
			>
				{props.message}
			</Alert>
		</Snackbar>
	);
};

export default AlertMessage;
