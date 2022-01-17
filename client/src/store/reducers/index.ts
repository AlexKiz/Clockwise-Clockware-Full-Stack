import {clockReducer} from './clock';
import {masterReducer} from './master';
import {combineReducers} from 'redux';
import {orderReducer} from './order';
import {orderFilteringReducer} from './orderFiltering';
import {cityReducer} from './city';

export const rootReducer = combineReducers({
	order: orderReducer,
	orderFiltering: orderFilteringReducer,
	city: cityReducer,
	master: masterReducer,
	clock: clockReducer,
});
