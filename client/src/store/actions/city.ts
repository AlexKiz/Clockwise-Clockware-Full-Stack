import {CityActionTypes, CityAction} from './../types/city';
import {Dispatch} from 'react';
import axios from 'axios';
import {URL} from '../../data/constants/routeConstants';
import {City} from 'src/data/types/types';


export const getCities = (cityName = '') => {
	return async (dispatch: Dispatch<CityAction>) => {
		const {data} = await axios.get<{count: number, rows: City[]}>(URL.CITY, {
			params: {
				limit: 5,
				offset: 0,
				cityName,
			},
		});

		dispatch({type: CityActionTypes.GET, payload: data.rows}); ;
	};
};

export const setCityName = (cityName: string) => {
	return {type: CityActionTypes.SET_NAME, payload: cityName};
};

export const setCityFilteringInstance = (cityInstance: City | null) => {
	return {type: CityActionTypes.SET_FILTER_INSTANCE, payload: cityInstance};
};
