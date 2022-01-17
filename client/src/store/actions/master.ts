import {MasterActionTypes, MasterAction} from './../types/master';
import {Dispatch} from 'react';
import axios from 'axios';
import {URL} from '../../data/constants/routeConstants';
import {Master} from 'src/data/types/types';


export const getMasters = (masterName: string = '') => {
	return async (dispatch: Dispatch<MasterAction>) => {
		const {data} = await axios.get<{count: number, rows: Master[]}>(URL.MASTER, {
			params: {
				limit: 5,
				offset: 0,
				masterName,
			},
		});

		dispatch({type: MasterActionTypes.GET, payload: data.rows});
	};
};

export const setMasterName = (masterName: string) => {
	return {type: MasterActionTypes.SET_NAME, payload: masterName};
};

export const setMasterFilteringInstance = (masterInstance: Master | null) => {
	return {type: MasterActionTypes.SET_FILTER_INSTANCE, payload: masterInstance};
};
