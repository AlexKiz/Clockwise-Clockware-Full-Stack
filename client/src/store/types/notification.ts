/* eslint-disable no-unused-vars */
import {AlertNotification} from './../../data/types/types';

export interface NotificationState {
    alertOptions: AlertNotification
}

export enum NotificationActionTypes {
    SET_ALERT_OPTIONS = 'SET_ALERT_OPTIONS',
};

interface SetAlertOptionsAction {
    type: NotificationActionTypes.SET_ALERT_OPTIONS,
    payload: AlertNotification
};

export type NotificationAction = SetAlertOptionsAction
