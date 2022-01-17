import {ModalActionTypes} from './../types/modal';


export const setModalImg = (images: string) => {
	return {type: ModalActionTypes.SET_MODAL_IMG, payload: images};
};

export const setIsModalOpen = (isOpen: boolean) => {
	return {type: ModalActionTypes.SET_IS_MODAL_OPEN, payload: isOpen};
};
