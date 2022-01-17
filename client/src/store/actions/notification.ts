import {AlertColor} from '@mui/material/Alert';
import {NotificationActionTypes} from '../types/notification';


export const setAlertOptions = (message: string, notify: boolean, type: AlertColor) => {
	return {type: NotificationActionTypes.SET_ALERT_OPTIONS, payload: {notify, message, type}};
};
