import {City} from 'src/data/types/types';

export interface CityState {
    cities: City[]
    cityName: string
    cityFilteringInstance: City | null
}

export enum CityActionTypes {
    GET = 'GET_CITIES',
    SET_NAME = 'SET_CITY_NAME',
    SET_FILTER_INSTANCE = 'SET_CITY_FILTER_INSTANCE',
}

interface GetCitiesAction {
    type: CityActionTypes.GET
    payload: City[]
}

interface SetCityName {
    type: CityActionTypes.SET_NAME
    payload: string
}

interface SetFilteringInstance {
    type: CityActionTypes.SET_FILTER_INSTANCE
    payload: City
}

export type CityAction = GetCitiesAction | SetCityName | SetFilteringInstance
