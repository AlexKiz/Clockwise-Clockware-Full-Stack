import {OrderAction, OrderState, OrderActionTypes} from '../types/order';


const initialState: OrderState = {
	orders: [],
	loading: false,
	error: null,
	page: 0,
	limit: 5,
	totalQuantity: 0,
	sortedField: 'id',
	sortingOrder: 'asc',
	masterFilteredId: null,
	cityFilteredId: null,
	clockFilteredId: null,
	isCompletedFilter: null,
	startDateFilter: null,
	endDateFilter: null,
};

export const orderReducer = (state = initialState, action: OrderAction): OrderState => {
	switch (action.type) {
	case OrderActionTypes.GET:
		return {...state, loading: true, error: null, orders: []};
	case OrderActionTypes.GET_SUCCESS:
		return {...state, loading: false, error: null, orders: action.payload};
	case OrderActionTypes.GET_ERROR:
		return {...state, loading: false, error: action.payload, orders: []};
	case OrderActionTypes.SET_PAGE:
		return {...state, page: action.payload};
	case OrderActionTypes.SET_LIMIT:
		return {...state, limit: action.payload};
	case OrderActionTypes.SET_QUANTITY:
		return {...state, totalQuantity: action.payload};
	case OrderActionTypes.SET_SORTING_FIELD:
		return {...state, sortedField: action.payload};
	case OrderActionTypes.SET_SORTING_ORDER:
		return {...state, sortingOrder: action.payload};
	case OrderActionTypes.SET_MASTER_FILTER:
		return {...state, masterFilteredId: action.payload};
	case OrderActionTypes.SET_CITY_FILTER:
		return {...state, cityFilteredId: action.payload};
	case OrderActionTypes.SET_CLOCK_FILTER:
		return {...state, clockFilteredId: action.payload};
	case OrderActionTypes.SET_COMPLETED_FILTER:
		return {...state, isCompletedFilter: action.payload};
	case OrderActionTypes.SET_START_DATE_FILTER:
		return {...state, startDateFilter: action.payload};
	case OrderActionTypes.SET_END_DATE_FILTER:
		return {...state, endDateFilter: action.payload};
	default:
		return state;
	}
};
