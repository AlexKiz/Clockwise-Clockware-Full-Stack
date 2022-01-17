import {ClockAction, ClockActionTypes} from './../types/clock';
import {Dispatch} from 'react';
import axios from 'axios';
import {URL} from '../../data/constants/routeConstants';
import {Clock} from 'src/data/types/types';
import {debouncer} from 'src/data/constants/systemUtilities';


export const getClocks = (clockSize: string = '') => {
	return async (dispatch: Dispatch<ClockAction>) => {
		const readClockData = debouncer(async () => {
			const {data} = await axios.get<Clock[]>(URL.CLOCK, {
				params: {
					clockSize,
				},
			});

			if (data.length) {
				dispatch({type: ClockActionTypes.GET, payload: data});
			}
		}, 200);
		readClockData();
	};
};

export const setClockSize = (clockSize: string) => {
	return {type: ClockActionTypes.SET_SIZE, payload: clockSize};
};

export const setClockFilteringInstance = (clockInstance: Clock | null) => {
	return {type: ClockActionTypes.SET_FILTER_INSTANCE, payload: clockInstance};
};
