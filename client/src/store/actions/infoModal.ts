import {InfoModalActionsTypes} from '../types/infoModal';


export const setOrderInfoOptions = (name: string, price: number, date: string, isInfoOpen: boolean, orderAddress: string | null) => {
	return {type: InfoModalActionsTypes.SET_INFO_OPTIONS, payload: {name, price, date, isInfoOpen, orderAddress}};
};
