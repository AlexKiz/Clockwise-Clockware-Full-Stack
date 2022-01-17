/* eslint-disable no-unused-vars */
export interface OrderFilteringState {
    masterFilteredId?: string | null
    cityFilteredId?: number | null
    clockFilteredId?: number | null
    isCompletedFilter?: boolean | null
    startDateFilter?: Date | null
    endDateFilter?: Date | null
};

export enum OrderFilteringActionTypes {
    SET_MASTER_FILTER = 'SET_MASTER_FILTER',
    SET_CITY_FILTER = 'SET_CITY_FILTER',
    SET_CLOCK_FILTER = 'SET_CLOCK_FILTER',
    SET_COMPLETED_FILTER = 'SET_COMPLETED_FILTER',
    SET_START_DATE_FILTER = 'SET_START_DATE_FILTER',
    SET_END_DATE_FILTER = 'SET_END_DATE_FILTER'
}

interface SetMasterFilterAction {
    type: OrderFilteringActionTypes.SET_MASTER_FILTER,
    payload: string | null
}

interface SetCityFilterAction {
    type: OrderFilteringActionTypes.SET_CITY_FILTER,
    payload: number | null
}

interface SetClockFilterAction {
    type: OrderFilteringActionTypes.SET_CLOCK_FILTER,
    payload: number | null
}

interface SetIsCompletedFilterAction {
    type: OrderFilteringActionTypes.SET_COMPLETED_FILTER,
    payload: boolean | null
}

interface SetStartDateFilterAction {
    type: OrderFilteringActionTypes.SET_START_DATE_FILTER,
    payload: Date | null
}

interface SetEndDateFilterAction {
    type: OrderFilteringActionTypes.SET_END_DATE_FILTER,
    payload: Date | null
};

export type OrderFilteringAction =
SetMasterFilterAction |
SetCityFilterAction |
SetClockFilterAction |
SetIsCompletedFilterAction |
SetStartDateFilterAction |
SetEndDateFilterAction
