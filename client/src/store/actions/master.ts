import {MasterActionTypes, MasterAction} from './../types/master';
import {Dispatch} from 'react';
import axios from 'axios';
import {URL} from '../../data/constants/routeConstants';
import {Master} from 'src/data/types/types';
import {debouncer} from 'src/data/constants/systemUtilities';


export const getMasters = (masterName: string = '') => {
	return async (dispatch: Dispatch<MasterAction>) => {
		const readMasterData = debouncer(async () => {
			const {data} = await axios.get<{count: number, rows: Master[]}>(URL.MASTER, {
				params: {
					limit: 5,
					offset: 0,
					masterName,
				},
			});

			if (data.rows.length) {
				dispatch({type: MasterActionTypes.GET, payload: data.rows});
			}
		}, 200);
		readMasterData();
	};
};

export const setMasterName = (masterName: string) => {
	return {type: MasterActionTypes.SET_NAME, payload: masterName};
};

export const setMasterFilteringInstance = (masterInstance: Master | null) => {
	return {type: MasterActionTypes.SET_FILTER_INSTANCE, payload: masterInstance};
};
