import {ModalActionTypes, ModalState, ModalAction} from '../types/modal';

const initialState: ModalState = {
	modalImg: '',
	isModalOpen: false,
};

export const modalReducer = (state = initialState, action: ModalAction): ModalState => {
	switch (action.type) {
	case ModalActionTypes.SET_IS_MODAL_OPEN:
		return {...state, isModalOpen: action.payload};
	case ModalActionTypes.SET_MODAL_IMG:
		return {...state, modalImg: action.payload};
	default:
		return state;
	}
};
