import {csvOrderShape, Order} from 'src/data/types/types';


export interface OrderState {
    orders: Order[]
    loading: boolean
    error: null | string
    page: number
    limit: number
    totalQuantity: number
    sortedField: string
    sortingOrder: 'asc' | 'desc'
    csvOrderData: csvOrderShape | null | any
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
    SET_CSV_ORDER_SHAPE = 'SET_CSV_ORDER_SHAPE'
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

interface SetCSVOrderShape {
    type: OrderActionTypes.SET_CSV_ORDER_SHAPE,
    payload: csvOrderShape
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
SetCSVOrderShape
