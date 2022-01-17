import {CityActionTypes, CityAction} from './../types/city';
import {Dispatch} from 'react';
import axios from 'axios';
import {URL} from '../../data/constants/routeConstants';
import {City} from 'src/data/types/types';
import {debouncer} from 'src/data/constants/systemUtilities';


export const getCity = (cityName: string = '') => {
	return async (dispatch: Dispatch<CityAction>) => {
		const readCityData = debouncer(async () => {
			const {data} = await axios.get<{count: number, rows: City[]}>(URL.CITY, {
				params: {
					limit: 5,
					offset: 0,
					cityName,
				},
			});

			if (data.rows.length) {
				dispatch({type: CityActionTypes.GET, payload: data.rows});
			}
		}, 200);
		readCityData();
	};
};

export const setCityName = (cityName: string) => {
	return {type: CityActionTypes.SET_NAME, payload: cityName};
};

export const setCityFilteringInstance = (cityInstance: City) => {
	return {type: CityActionTypes.SET_FILTER_INSTANCE, payload: cityInstance};
};
