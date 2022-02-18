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
	ORDER_FOR_UPDATE = '/orderForUpdate',
	CITY_FOR_UPDATE = '/cityForUpdate',
    RATED_ORDER = '/ratedOrder',
    ORDERS_RATING = '/ordersRating',
	REGISTRATION = '/user/registration',
	VERIFY = '/user/verify',
	COMPLETE_ORDER = '/completeOrder',
	EXPORT_XLSX = '/exportXLSX',
	STRIPE = 'stripe',
	TOTAL_ORDERS_CHART = 'totalOrdersChart',
	TOTAL_ORDERS_CITIES_PIE_CHART = '/totalOrdersForCitiesPieChart',
    TOTAL_ORDERS_MASTERS_PIE_CHART = '/totalOrdersForMastersPieChart',
	MASTERS_STATISTICS_TABLE = '/mastersStatisticsTable',
	ORDERS_FOR_CALENDAR = '/ordersForCalendar',
}

export enum RESOURCE {
    ADMIN = 'admin',
	MASTER = 'master',
	CLIENT = 'client',
    CITY_CREATE = 'city-create',
    CITIES_LIST = 'cities-list',
    ORDER_CREATE = 'order-create',
    ORDERS_LIST = 'orders-list',
    MASTER_CREATE = 'master-create',
    MASTERS_LIST = 'masters-list',
    USER_CREATE = 'user-create',
    USERS_LIST = 'users-list',
    LOGIN = 'login',
    RATE = 'rate',
    REGISTRATION = 'registration-form',
	VERIFICATION = 'email-verification',
	STATISTICS = 'statistics',
	CALENDAR = 'calendar',
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
    RATING_ID = 'ratingIdentificatorParam',
	HASH_VERIFY = 'hashVerify',
	GENERATED = 'generated'
}

export const ROUTES = {
	ORDER_FORM: {
		path: '/',
		exact: true,
	},
	REGISTRATION: {
		path: `/${RESOURCE.REGISTRATION}`,
	},
	ADMIN_MASTERS_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.MASTERS_LIST}`,
	},
	ADMIN_MASTER_CREATE: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.MASTER_CREATE}/:${PARAM.MASTER_ID}?/:${PARAM.MASTER_NAME}?`,
	},
	ADMIN_USERS_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.USERS_LIST}`,
	},
	ADMIN_USER_CREATE: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.USER_CREATE}/:${PARAM.USER_ID}?/:${PARAM.USER_NAME}?/:${PARAM.USER_EMAIL}?`,
	},
	ADMIN_CITIES_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.CITIES_LIST}`,
	},
	ADMIN_CITY_CREATE: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.CITY_CREATE}/:${PARAM.CITY_NAME}?`,
	},
	ADMIN_ORDERS_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`,
	},
	ADMIN_STATISTICS: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.STATISTICS}`,
	},
	MASTER_ORDERS_LIST: {
		path: `/${RESOURCE.MASTER}/${RESOURCE.ORDERS_LIST}`,
	},
	MASTER_CALENDAR: {
		path: `/${RESOURCE.MASTER}/${RESOURCE.CALENDAR}`,
	},
	CLIENT_ORDERS_LIST: {
		path: `/${RESOURCE.CLIENT}/${RESOURCE.ORDERS_LIST}`,
	},
	ADMIN_ORDER_CREATE: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.ORDER_CREATE}/:${PARAM.ORDER_ID}?`,
	},
	LOGIN: {
		path: `/${RESOURCE.LOGIN}`,
	},
	RATE_ORDER: {
		path: `/${RESOURCE.RATE}/:${PARAM.RATING_ID}?`,
	},
	USER_VERIFY: {
		path: `/${RESOURCE.VERIFICATION}/:${PARAM.HASH_VERIFY}?/:${PARAM.GENERATED}?`,
	},
};
