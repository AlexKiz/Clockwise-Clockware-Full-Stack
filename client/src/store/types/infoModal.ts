import {InfoOptions} from './../../data/types/types';

export interface InfoModalState {
    infoOptions: InfoOptions
}

export enum InfoModalActionsTypes {
    SET_INFO_OPTIONS = 'SET_INFO_OPTIONS',
}

interface SetInfoOptionsAction {
    type: InfoModalActionsTypes.SET_INFO_OPTIONS,
    payload: InfoOptions
}

export type InfoModalAction = SetInfoOptionsAction
