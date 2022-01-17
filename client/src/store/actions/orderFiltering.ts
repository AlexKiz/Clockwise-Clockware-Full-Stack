import {DateRange} from '@mui/lab/DateRangePicker/RangeTypes';
import {OrderFilteringActionTypes} from '../types/orderFiltering';

export const setMasterFilter = (masterFilteredId: string| null) => {
	return {type: OrderFilteringActionTypes.SET_MASTER_FILTER, payload: masterFilteredId};
};

export const setCityFilter = (cityFilteredId: number | null) => {
	return {type: OrderFilteringActionTypes.SET_CITY_FILTER, payload: cityFilteredId};
};

export const setClockFilter = (clockFilteredId: number | null) => {
	return {type: OrderFilteringActionTypes.SET_CLOCK_FILTER, payload: clockFilteredId};
};

export const setIsCompletedFilter = (isCompletedFilter: boolean | null) => {
	return {type: OrderFilteringActionTypes.SET_COMPLETED_FILTER, payload: isCompletedFilter};
};

export const setDateFilteringArray = (date: DateRange<[Date | null, Date | null]>) => {
	return {type: OrderFilteringActionTypes.SET_DATE_FILTER_ARRAY, payload: date};
};

export const setStartDateFilter = (startDateFilter: Date | null) => {
	return {type: OrderFilteringActionTypes.SET_START_DATE_FILTER, payload: startDateFilter};
};

export const setEndDateFilter = (endDateFilter: Date | null) => {
	return {type: OrderFilteringActionTypes.SET_END_DATE_FILTER, payload: endDateFilter};
};

export const setIsFiltersListOpen = (isOpen: boolean) => {
	return {type: OrderFilteringActionTypes.SET_IS_FILTERS_LIST_OPEN, payload: isOpen};
};

export const setIsFiltersButtonsDisabled = (accept: boolean, reset: boolean) => {
	return {type: OrderFilteringActionTypes.SET_IS_FILTERS_BUTTONS_DISABLED, payload: {accept, reset}};
};
