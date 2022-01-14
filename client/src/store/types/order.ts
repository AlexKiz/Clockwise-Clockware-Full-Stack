/* eslint-disable no-unused-vars */
import {Order} from 'src/data/types/types';


export interface OrderState {
    orders: Order[]
    loading: boolean
    error: null | string
    page: number
    limit: number
    totalQuantity: number
    sortedField: string
    sortingOrder: 'asc' | 'desc'
    masterFilteredId?: string | null
    cityFilteredId?: number | null
    clockFilteredId?: number | null
    isCompletedFilter?: boolean | null
    startDateFilter?: Date | null
    endDateFilter?: Date| null
}

export enum OrderActionTypes {
    GET = 'GET_ORDERS',
    GET_SUCCESS = 'GET_ORDERS_SUCCESS',
    GET_ERROR = 'GET_ORDERS_ERROR',
    SET_PAGE = 'SET_ORDERS_PAGE',
    SET_LIMIT = 'SET_ORDERS_LIMIT',
    SET_QUANTITY = 'SET_ORDERS_QUANTITY',
    SET_SORTING_FIELD = 'SET_ORDERS_SORTING_FIELD',
    SET_SORTING_ORDER = 'SET_ORDERS_SORTING_ORDER',
    SET_MASTER_FILTER = 'SET_MASTER_FILTER',
    SET_CITY_FILTER = 'SET_CITY_FILTER',
    SET_CLOCK_FILTER = 'SET_CLOCK_FILTER',
    SET_COMPLETED_FILTER = 'SET_COMPLETED_FILTER',
    SET_START_DATE_FILTER = 'SET_START_DATE_FILTER',
    SET_END_DATE_FILTER = 'SET_END_DATE_FILTER'
}

interface GetOrdersAction {
    type: OrderActionTypes.GET,
}

interface GetOrdersActionSuccess {
    type: OrderActionTypes.GET_SUCCESS,
    payload: Order[]
}

interface GetOrdersActionError {
    type: OrderActionTypes.GET_ERROR,
    payload: string,
}

interface SetOrdersPageAction {
    type: OrderActionTypes.SET_PAGE,
    payload: number,
}

interface SetOrdersLimitAction {
    type: OrderActionTypes.SET_LIMIT,
    payload: number,
}

interface SetOrdersQuantityAction {
    type: OrderActionTypes.SET_QUANTITY,
    payload: number,
}

interface SetOrdersSortingFieldAction {
    type: OrderActionTypes.SET_SORTING_FIELD,
    payload: string
}

interface SetOrdersSortingOrderAction {
    type: OrderActionTypes.SET_SORTING_ORDER,
    payload: 'asc' | 'desc'
}

interface SetMasterFilterAction {
    type: OrderActionTypes.SET_MASTER_FILTER,
    payload: string
}

interface SetCityFilterAction {
    type: OrderActionTypes.SET_CITY_FILTER,
    payload: number
}

interface SetClockFilterAction {
    type: OrderActionTypes.SET_CLOCK_FILTER,
    payload: number
}

interface SetIsCompletedFilterAction {
    type: OrderActionTypes.SET_COMPLETED_FILTER,
    payload: boolean
}

interface SetStartDateFilterAction {
    type: OrderActionTypes.SET_START_DATE_FILTER,
    payload: Date
}

interface SetEndDateFilterAction {
    type: OrderActionTypes.SET_END_DATE_FILTER,
    payload: Date
}

export type OrderAction =
GetOrdersAction |
GetOrdersActionSuccess |
GetOrdersActionError |
SetOrdersPageAction |
SetOrdersLimitAction |
SetOrdersQuantityAction |
SetOrdersSortingFieldAction |
SetOrdersSortingOrderAction |
SetMasterFilterAction |
SetCityFilterAction |
SetClockFilterAction |
SetIsCompletedFilterAction |
SetStartDateFilterAction |
SetEndDateFilterAction
