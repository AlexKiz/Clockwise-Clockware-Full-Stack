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
	STRIPE = '/stripe',
	TOTAL_ORDERS_CHART = 'totalOrdersChart',
	TOTAL_ORDERS_CITIES_PIE_CHART = '/totalOrdersForCitiesPieChart',
    TOTAL_ORDERS_MASTERS_PIE_CHART = '/totalOrdersForMastersPieChart',
	MASTERS_STATISTICS_TABLE = '/mastersStatisticsTable',
	ORDERS_FOR_CALENDAR = '/ordersForCalendar',
	BLOG = '/blog',
	ARTICLE = '/article',
	IMAGE = '/image',
	ARTICLE_FOR_UPDATE = '/articleForUpdate',
	GEO_COORDINATES = '/geoCoordinates'
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
	BLOG = 'blog',
	ARTICLE = 'article',
	ARTICLES_LIST = 'articles-list',
	ARTICLE_CREATE = 'articles-create',
	GEO_SERVICE = 'geo-service',
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
	GENERATED = 'generated',
	ARTICLE_TITLE = 'articleTitle',
	PAYMENT_MESSAGE = 'paymentMessage'
}

export const ROUTES = {
	ORDER_FORM: {
		path: `/`,
		exact: true,
	},
	REGISTRATION: {
		path: `/${RESOURCE.REGISTRATION}`,
	},
	BLOG: {
		path: `/${RESOURCE.BLOG}`,
	},
	ARTICLE: {
		path: `/${RESOURCE.ARTICLE}/:${PARAM.ARTICLE_TITLE}`,
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
	ADMIN_ARTICLES_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.ARTICLES_LIST}`,
	},
	ADMIN_ARTICLE_CREATE: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.ARTICLE_CREATE}/:${PARAM.ARTICLE_TITLE}?`,
	},
	ADMIN_GEO_SERVICE: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.GEO_SERVICE}`,
	},
	MASTER_ORDERS_LIST: {
		path: `/${RESOURCE.MASTER}/${RESOURCE.ORDERS_LIST}`,
	},
	MASTER_CALENDAR: {
		path: `/${RESOURCE.MASTER}/${RESOURCE.CALENDAR}`,
	},
	MASTER_BLOG: {
		path: `/${RESOURCE.MASTER}/${RESOURCE.BLOG}`,
	},
	MASTER_ARTICLE: {
		path: `/${RESOURCE.MASTER}/${RESOURCE.ARTICLE}/:${PARAM.ARTICLE_TITLE}`,
	},
	CLIENT_ORDERS_LIST: {
		path: `/${RESOURCE.CLIENT}/${RESOURCE.ORDERS_LIST}`,
	},
	CLIENT_BLOG: {
		path: `/${RESOURCE.CLIENT}/${RESOURCE.BLOG}`,
	},
	CLIENT_ARTICLE: {
		path: `/${RESOURCE.CLIENT}/${RESOURCE.ARTICLE}/:${PARAM.ARTICLE_TITLE}`,
	},
	ADMIN_ORDER_CREATE: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.ORDER_CREATE}/:${PARAM.ORDER_ID}?`,
	},
	LOGIN: {
		path: `/${RESOURCE.LOGIN}/:${PARAM.PAYMENT_MESSAGE}?`,
	},
	RATE_ORDER: {
		path: `/${RESOURCE.RATE}/:${PARAM.RATING_ID}?`,
	},
	USER_VERIFY: {
		path: `/${RESOURCE.VERIFICATION}/:${PARAM.HASH_VERIFY}?/:${PARAM.GENERATED}?`,
	},
};
