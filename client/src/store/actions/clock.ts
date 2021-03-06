import {ClockAction, ClockActionTypes} from './../types/clock';
import {Dispatch} from 'react';
import axios from 'axios';
import {URL} from '../../data/constants/routeConstants';
import {Clock} from 'src/data/types/types';

export const getClocks = (clockSize = '') => {
	return async (dispatch: Dispatch<ClockAction>) => {
		const {data} = await axios.get<Clock[]>(URL.CLOCK, {
			params: {
				clockSize,
			},
		});
		dispatch({type: ClockActionTypes.GET, payload: data});
	};
};

export const setClockSize = (clockSize: string) => {
	return {type: ClockActionTypes.SET_SIZE, payload: clockSize};
};

export const setClockFilteringInstance = (clockInstance: Clock | null) => {
	return {type: ClockActionTypes.SET_FILTER_INSTANCE, payload: clockInstance};
};
