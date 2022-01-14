/* eslint-disable max-len */
import {Dispatch} from 'react';
import axios from 'axios';
import {OrderAction, OrderActionTypes} from '../types/order';
import {URL} from '../../data/constants/routeConstants';
import {Order} from 'src/data/types/types';

export const getOrders = (page = 0, limit = 5, sortingField = 'id', sortingOrder = 'asc', masterFilteredId?: string | null, cityFilteredId?: number | null, clockFilteredId?: number | null, isCompletedFilter?: boolean | null, startDateFilter?: Date | null, endDateFilter?: Date | null) => {
	return async (dispatch: Dispatch<OrderAction>) => {
		try {
			dispatch({type: OrderActionTypes.GET});
			const {data} = await axios.get<{count: number, rows: Order[]}>(URL.ORDER, {
				params: {
					limit,
					offset: limit * page,
					sortedField: sortingField,
					sortingOrder,
					masterFilteredId,
					cityFilteredId,
					clockFilteredId,
					isCompletedFilter,
					startDateFilter,
					endDateFilter,
				},
			});
			dispatch({type: OrderActionTypes.GET_SUCCESS, payload: data.rows});
		} catch (e) {
			dispatch({
				type: OrderActionTypes.GET_ERROR,
				payload: 'There is an error occurred while loading orders!',
			});
		}
	};
};

export const setOrdersPage = (page: number) => {
	return {type: OrderActionTypes.SET_PAGE, payload: page};
};

export const setOrdersLimit = (limit: number) => {
	return {type: OrderActionTypes.SET_LIMIT, payload: limit};
};

export const setOrdersQuantity = (totalQuantity: number) => {
	return {type: OrderActionTypes.SET_QUANTITY, payload: totalQuantity};
};

export const setOrdersSortingField = (sortingField: string) => {
	return {type: OrderActionTypes.SET_SORTING_FIELD, payload: sortingField};
};

export const setOrdersSortingOrder = (sortingOrder: 'asc' | 'desc') => {
	return {type: OrderActionTypes.SET_SORTING_ORDER, payload: sortingOrder};
};

export const setMasterFilter = (masterFilteredId: string| null) => {
	return {type: OrderActionTypes.SET_MASTER_FILTER, payload: masterFilteredId};
};

export const setCityFilter = (cityFilteredId: number | null) => {
	return {type: OrderActionTypes.SET_CITY_FILTER, payload: cityFilteredId};
};

export const setClockFilter = (clockFilteredId: number | null) => {
	return {type: OrderActionTypes.SET_CLOCK_FILTER, payload: clockFilteredId};
};

export const setIsCompletedFilter = (isCompletedFilter: boolean | null) => {
	return {type: OrderActionTypes.SET_COMPLETED_FILTER, payload: isCompletedFilter};
};

export const setStartDateFilter = (startDateFilter: Date | null) => {
	return {type: OrderActionTypes.SET_START_DATE_FILTER, payload: startDateFilter};
};

export const setEndDateFilter = (endDateFilter: Date | null) => {
	return {type: OrderActionTypes.SET_END_DATE_FILTER, payload: endDateFilter};
};
