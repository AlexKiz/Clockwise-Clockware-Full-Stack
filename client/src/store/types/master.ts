/* eslint-disable no-unused-vars */
import {Master} from 'src/data/types/types';

export interface MasterState {
    masters: Master[]
    masterName: string
    masterFilteringInstance: Master | null
}

export enum MasterActionTypes {
    GET = 'GET_MASTERS',
    SET_NAME = 'SET_MASTER_NAME',
    SET_FILTER_INSTANCE = 'SET_FILTER_INSTANCE',
};

interface GetMastersAction {
    type: MasterActionTypes.GET
    payload: Master[]
};

interface SetMasterName {
    type: MasterActionTypes.SET_NAME
    payload: string
};

interface SetFilteringInstance {
    type: MasterActionTypes.SET_FILTER_INSTANCE
    payload: Master
};

export type MasterAction = GetMastersAction | SetMasterName | SetFilteringInstance
