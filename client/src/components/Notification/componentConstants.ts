import {AlertColor} from '@mui/material/Alert';

export interface AlertProps {
    message: string,
	alertType: AlertColor
    notify: boolean
    isOpen(value:boolean): any
}
