import {NotificationAction, NotificationActionTypes, NotificationState} from './../types/notification';


const initialState: NotificationState = {
	alertOptions: {
		notify: false,
		message: '',
		type: 'success',
	},
};

export const notificationReducer = (state = initialState, action: NotificationAction): NotificationState => {
	switch (action.type) {
	case NotificationActionTypes.SET_ALERT_OPTIONS:
		return {...state, alertOptions: action.payload};
	default:
		return state;
	}
};
