import {RESOURCE} from 'src/data/constants/routeConstants';

export const MENU_LINKS = [{
	title: 'header.make',
	path: '/',
	name: '',
}, {
	title: 'header.login',
	path: '/login',
	name: 'login',
}, {
	title: 'header.signUp',
	path: '/registration-form',
	name: 'registration-form',
}];

export const ADMIN_MENU_LINKS = [{
	title: 'Users List',
	path: '/admin/users-list',
	name: 'users-list',
}, {
	title: 'Cities List',
	path: '/admin/cities-list',
	name: 'cities-list',
}, {
	title: 'Masters List',
	path: '/admin/masters-list',
	name: 'masters-list',
}, {
	title: 'Orders List',
	path: '/admin/orders-list',
	name: 'orders-list',
}, {
	title: 'Statistics',
	path: '/admin/statistics',
	name: 'statistics',
}];

export const MASTER_MENU_LINKS = [{
	title: 'Orders',
	path: '/master/orders-list',
	name: 'orders-list',
}, {
	title: 'Calendar',
	path: '/master/calendar',
	name: 'calendar',
}];

export const CLIENT_MENU_LINKS = [{
	title: 'Orders',
	path: '/client/orders-list',
	name: 'orders-list',
}];

export const roleMappingHeaderLink = {
	'admin': ADMIN_MENU_LINKS,
	'master': MASTER_MENU_LINKS,
	'client': CLIENT_MENU_LINKS,
};

export const roleMappingHeaderLogo = {
	'admin': `/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`,
	'master': `/${RESOURCE.MASTER}/${RESOURCE.ORDERS_LIST}`,
	'client': `/${RESOURCE.CLIENT}/${RESOURCE.ORDERS_LIST}`,
};

export const languageSelect = [
	{code: 'en', name: 'English'},
	{code: 'ru', name: 'Russian'},
	{code: 'ukr', name: 'Ukrainian'},
];
