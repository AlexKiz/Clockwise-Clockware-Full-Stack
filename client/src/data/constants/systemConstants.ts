/* eslint-disable max-len */
export const OPENING_HOURS: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
export const ACCESS_TOKEN = 'accessToken';

export const VALID = {
	NAME: new RegExp(/^([(A-Za-zА-Яа-я]{3,49})$|^([A-Za-zА-Яа-я]{3,49}[\s]{1}[A-Za-zА-Яа-я]{3,50})$/),
	EMAIL: new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
	CITY: new RegExp(/^[A-Za-zА-Яа-я]{3,100}$|^[A-Za-zА-Яа-я]{3,49}[-\s]{1}[A-Za-zА-Яа-я]{3,50}$/),
	PASSWORD: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{0,}$/),
};

export enum ROLE {
	ADMIN = 'admin',
    MASTER = 'master',
	CLIENT = 'client',
}

export enum SORTED_FIELD {
	ID = 'id',
	NAME = 'name',
	EMAIL = 'email',
	RATING = 'rating',
	CLOCK_SIZE = 'clock.size',
	USER_NAME = 'user.name',
	USER_EMAIL = 'user.email',
	CITY_NAME = 'city.name',
	MASTER_NAME = 'master.name',
	START_WORK_ON = 'startWorkOn',
	END_WORK_ON = 'endWorkOn',
	SMALL_CLOCKS = 'smallClocks',
	MEDIUM_CLOCKS = 'mediumClocks',
	LARGE_CLOCKS = 'largeClocks',
	COMPLETED = 'completed',
	UNCOMPLETED = 'uncompleted',
	EARNED_AMOUNT = 'earnedAmount'
}

export enum SORTING_ORDER {
	ASC = 'asc',
	DESC = 'desc'
}
