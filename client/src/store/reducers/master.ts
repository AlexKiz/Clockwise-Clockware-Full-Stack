import {MasterAction, MasterActionTypes, MasterState} from '../types/master';


const initialState: MasterState = {
	masters: [],
	masterName: '',
	masterFilteringInstance: null,
};

export const masterReducer = (state = initialState, action: MasterAction): MasterState => {
	switch (action.type) {
	case MasterActionTypes.GET:
		return {...state, masters: action.payload};
	case MasterActionTypes.SET_NAME:
		return {...state, masterName: action.payload};
	case MasterActionTypes.SET_FILTER_INSTANCE:
		return {...state, masterFilteringInstance: action.payload};
	default:
		return state;
	}
};
