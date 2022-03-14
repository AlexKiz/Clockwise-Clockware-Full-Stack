import {InfoModalActionsTypes, InfoModalState, InfoModalAction} from './../types/infoModal';


const initialState: InfoModalState = {
	infoOptions: {
		name: '',
		price: 0,
		date: '',
		isInfoOpen: false,
		orderAddress: null,
	},
};

export const infoModalReducer = (state = initialState, action: InfoModalAction): InfoModalState => {
	if ( action.type === InfoModalActionsTypes.SET_INFO_OPTIONS) {
		return {infoOptions: action.payload};
	} else {
		return state;
	}
};
