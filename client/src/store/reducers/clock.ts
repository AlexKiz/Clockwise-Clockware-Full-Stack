import {ClockState, ClockAction, ClockActionTypes} from './../types/clock';


const initialState: ClockState = {
	clocks: [],
	clockSize: '',
	clockFilteringInstance: null,
};

export const clockReducer = (state = initialState, action: ClockAction): ClockState => {
	switch (action.type) {
	case ClockActionTypes.GET:
		return {...state, clocks: action.payload};
	case ClockActionTypes.SET_SIZE:
		return {...state, clockSize: action.payload};
	case ClockActionTypes.SET_FILTER_INSTANCE:
		return {...state, clockFilteringInstance: action.payload};
	default:
		return state;
	}
};
