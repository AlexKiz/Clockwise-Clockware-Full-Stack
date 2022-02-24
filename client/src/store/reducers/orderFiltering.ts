import {OrderFilteringAction, OrderFilteringActionTypes, OrderFilteringState} from './../types/orderFiltering';


const initialState: OrderFilteringState = {
	masterFilteredId: null,
	cityFilteredId: null,
	clockFilteredId: null,
	isCompletedFilter: null,
	dateFilteringArray: [null, null],
	startDateFilter: null,
	endDateFilter: null,
	isFiltersListOpen: false,
	isFiltersButtonsDisabled: {accept: false, reset: true},
};

export const orderFilteringReducer = (state = initialState, action: OrderFilteringAction): OrderFilteringState => {
	switch (action.type) {
	case OrderFilteringActionTypes.SET_MASTER_FILTER:
		return {...state, masterFilteredId: action.payload};
	case OrderFilteringActionTypes.SET_CITY_FILTER:
		return {...state, cityFilteredId: action.payload};
	case OrderFilteringActionTypes.SET_CLOCK_FILTER:
		return {...state, clockFilteredId: action.payload};
	case OrderFilteringActionTypes.SET_COMPLETED_FILTER:
		return {...state, isCompletedFilter: action.payload};
	case OrderFilteringActionTypes.SET_DATE_FILTER_ARRAY:
		return {...state, dateFilteringArray: action.payload};
	case OrderFilteringActionTypes.SET_START_DATE_FILTER:
		return {...state, startDateFilter: action.payload};
	case OrderFilteringActionTypes.SET_END_DATE_FILTER:
		return {...state, endDateFilter: action.payload};
	case OrderFilteringActionTypes.SET_IS_FILTERS_LIST_OPEN:
		return {...state, isFiltersListOpen: action.payload};
	case OrderFilteringActionTypes.SET_IS_FILTERS_BUTTONS_DISABLED:
		return {...state, isFiltersButtonsDisabled: action.payload};
	default:
		return state;
	}
};
