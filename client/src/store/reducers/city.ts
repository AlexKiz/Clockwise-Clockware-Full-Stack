import {CityAction, CityActionTypes, CityState} from '../types/city';

const initialState: CityState = {
	cities: [],
	cityName: '',
	cityFilteringInstance: null,
};

export const cityReducer = (state = initialState, action: CityAction): CityState => {
	switch (action.type) {
	case CityActionTypes.GET:
		return {...state, cities: action.payload};
	case CityActionTypes.SET_NAME:
		return {...state, cityName: action.payload};
	case CityActionTypes.SET_FILTER_INSTANCE:
		return {...state, cityFilteringInstance: action.payload};
	default:
		return state;
	}
};
