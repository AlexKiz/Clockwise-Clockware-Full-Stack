/* eslint-disable no-unused-vars */
export interface ModalState {
    modalImg: string
    isModalOpen: boolean
};

export enum ModalActionTypes {
    SET_MODAL_IMG = 'SET_MODAL_IMG',
    SET_IS_MODAL_OPEN = 'SET_IS_MODAL_OPEN',
};

interface SetModalImg {
    type: ModalActionTypes.SET_MODAL_IMG
    payload: string
};

interface SetIsModalOpen {
    type: ModalActionTypes.SET_IS_MODAL_OPEN
    payload: boolean
};

export type ModalAction = SetModalImg | SetIsModalOpen
