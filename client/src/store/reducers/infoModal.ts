import {InfoModalActionsTypes, InfoModalState, InfoModalAction} from './../types/infoModal';


const initialState: InfoModalState = {
	infoOptions: {
		name: '',
		price: 0,
		date: '',
		isInfoOpen: false,
	},
};

export const infoModalReducer = (state = initialState, action: InfoModalAction): InfoModalState => {
	switch (action.type) {
	case InfoModalActionsTypes.SET_INFO_OPTIONS:
		return {infoOptions: action.payload};
	default:
		return state;
	}
};
