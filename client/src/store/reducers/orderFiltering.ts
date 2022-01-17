import {OrderFilteringAction, OrderFilteringActionTypes, OrderFilteringState} from './../types/orderFiltering';


const initialState: OrderFilteringState = {
	masterFilteredId: null,
	cityFilteredId: null,
	clockFilteredId: null,
	isCompletedFilter: null,
	startDateFilter: null,
	endDateFilter: null,
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
	case OrderFilteringActionTypes.SET_START_DATE_FILTER:
		return {...state, startDateFilter: action.payload};
	case OrderFilteringActionTypes.SET_END_DATE_FILTER:
		return {...state, endDateFilter: action.payload};
	default:
		return state;
	};
};
