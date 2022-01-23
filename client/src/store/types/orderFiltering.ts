import {DateRange} from '@mui/lab/DateRangePicker/RangeTypes';

export interface OrderFilteringState {
    masterFilteredId?: string | null
    cityFilteredId?: number | null
    clockFilteredId?: number | null
    isCompletedFilter?: boolean | null
    dateFilteringArray: DateRange<Date>
    startDateFilter?: Date | null
    endDateFilter?: Date | null
    isFiltersListOpen: boolean
    isFiltersButtonsDisabled: {accept: boolean, reset: boolean}
}

export enum OrderFilteringActionTypes {
    SET_MASTER_FILTER = 'SET_MASTER_FILTER',
    SET_CITY_FILTER = 'SET_CITY_FILTER',
    SET_CLOCK_FILTER = 'SET_CLOCK_FILTER',
    SET_COMPLETED_FILTER = 'SET_COMPLETED_FILTER',
    SET_DATE_FILTER_ARRAY = 'SET_DATE_FILTER_ARRAY',
    SET_START_DATE_FILTER = 'SET_START_DATE_FILTER',
    SET_END_DATE_FILTER = 'SET_END_DATE_FILTER',
    SET_IS_FILTERS_LIST_OPEN = 'SET_IS_FILTER_LIST_OPEN',
    SET_IS_FILTERS_BUTTONS_DISABLED = 'SET_IS_FILTERS_BUTTONS_DISABLED',
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

interface SetDateFilterArray {
    type: OrderFilteringActionTypes.SET_DATE_FILTER_ARRAY,
    payload: DateRange<Date>
}

interface SetStartDateFilterAction {
    type: OrderFilteringActionTypes.SET_START_DATE_FILTER,
    payload: Date | null
}

interface SetEndDateFilterAction {
    type: OrderFilteringActionTypes.SET_END_DATE_FILTER,
    payload: Date | null
}

interface SetIsFiltersListOpen {
    type: OrderFilteringActionTypes.SET_IS_FILTERS_LIST_OPEN,
    payload: boolean
}

interface SetIsFiltersButtonsDisabled {
    type: OrderFilteringActionTypes.SET_IS_FILTERS_BUTTONS_DISABLED,
    payload: {accept: boolean, reset: boolean}
}

export type OrderFilteringAction =
SetMasterFilterAction |
SetCityFilterAction |
SetClockFilterAction |
SetIsCompletedFilterAction |
SetDateFilterArray |
SetStartDateFilterAction |
SetEndDateFilterAction |
SetIsFiltersListOpen |
SetIsFiltersButtonsDisabled


