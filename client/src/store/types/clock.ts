/* eslint-disable no-unused-vars */
import {Clock} from 'src/data/types/types';

export interface ClockState {
    clocks: Clock[]
    clockSize: string
    clockFilteringInstance: Clock | null,
};

export enum ClockActionTypes {
    GET = 'GET_CLOCKS',
    SET_SIZE = 'SET_CLOCK_SIZE',
    SET_FILTER_INSTANCE = 'SET_FILTER_INSTANCE',
};

interface GetClocksAction {
    type: ClockActionTypes.GET
    payload: Clock[]
};

interface SetClockSize {
    type: ClockActionTypes.SET_SIZE
    payload: string
};

interface SetFilteringInstance {
    type: ClockActionTypes.SET_FILTER_INSTANCE
    payload: Clock
};

export type ClockAction = GetClocksAction | SetClockSize | SetFilteringInstance
