/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
export enum URL {
    CITY = '/city',
    LOGIN = '/login',
    MASTER = '/master',
    USER = '/user',
    CLOCK = '/clocks',
    ORDER = '/order',
    AVAILABLE_MASTER = '/availableMasters',
    CITY_FOR_ORDER = '/cityForOrder',
    ORDER_FOR_RATE = '/orderForRate',
    RATED_ORDER = '/ratedOrder',
    ORDERS_RATING = '/ordersRating'
}

export enum RESOURCE {
    ADMIN = 'admin',
    CITY_CONTROLER = 'city-controller',
    CITIES_LIST = 'cities-list',
    ORDER_CONTROLLER = 'order-controller',
    ORDERS_LIST = 'orders-list',
    MASTER_CONTROLLER = 'master-controller',
    MASTERS_LIST = 'masters-list',
    USER_CONTROLLER = 'user-controller',
    USERS_LIST = 'users-list',
    LOGIN = 'login',
    RATE = 'rate'
}

export enum PARAM {
    MASTER_ID = 'masterIdParam',
    MASTER_NAME = 'masterNameParam',
    USER_ID = 'userIdParam',
    USER_NAME = 'userNameParam',
    USER_EMAIL = 'userEmailParam',
    CITY_ID = 'cityIdParam',
    CITY_NAME = 'cityNameParam',
    ORDER_ID = 'orderIdParam',
    ORDER_DATE = 'orderDateParam',
    ORDER_TIME = 'orderTimeParam',
    CLOCK_ID = 'clockIdParam',
    RATING_ID = 'ratingIdentificatorParam'
}

export const ROUTES = {
	ORDER_FORM: {
		path: '/',
		exact: true,
	},
	ADMIN_MASTERS_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.MASTERS_LIST}`,
	},
	ADMIN_MASTER_CONTROLLER: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.MASTER_CONTROLLER}/:${PARAM.MASTER_ID}?/:${PARAM.MASTER_NAME}?`,
	},
	ADMIN_USERS_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.USERS_LIST}`,
	},
	ADMIN_USER_CONTROLLER: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.USER_CONTROLLER}/:${PARAM.USER_ID}?/:${PARAM.USER_NAME}?/:${PARAM.USER_EMAIL}?`,
	},
	ADMIN_CITIES_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.CITIES_LIST}`,
	},
	ADMIN_CITY_CONTROLLER: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.CITY_CONTROLER}/:${PARAM.CITY_ID}?/:${PARAM.CITY_NAME}?`,
	},
	ADMIN_ORDERS_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`,
	},
	ADMIN_ORDER_CONTROLLER: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.ORDER_CONTROLLER}/:${PARAM.ORDER_ID}?/:${PARAM.USER_ID}?/:${PARAM.CLOCK_ID}?/:${PARAM.CITY_ID}?/:${PARAM.ORDER_DATE}?/:${PARAM.ORDER_TIME}?/:${PARAM.MASTER_ID}?`,
	},
	ADMIN_LOGIN: {
		path: `/${RESOURCE.LOGIN}`,
	},
	RATE_ORDER: {
		path: `/${RESOURCE.RATE}/:${PARAM.RATING_ID}?`,
	},
};
