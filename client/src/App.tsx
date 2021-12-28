/* eslint-disable require-jsdoc */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-len */
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import OrderForm from './components/Order/order.form/OrderForm';
import MastersList from './components/Admin/master.list/MastersList';
import MasterController from './components/Admin/master.controller/MasterController';
import UsersList from './components/Admin/user.list/UsersList';
import UserController from './components/Admin/user.controller/UserController';
import CitiesList from './components/Admin/cities.list/CitiesList';
import CityController from './components/Admin/city.controller/CityController';
import OrdersList from './components/Admin/orders.list/OrdersList';
import OrderController from './components/Admin/order.controller/OrderController';
import LoginForm from './components/Admin/login/LoginForm';
import PrivatRoute from './components/Route/PrivatRoute';
import RateOrder from './components/Order/order.rate/RateOrder';
import {PARAM, RESOURCE} from './data/constants/routeConstants';


const ROUTES = {
	ORDER_FORM: {
		path: '/',
		exact: true,
		component: OrderForm,
	},
	ADMIN_MASTERS_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.MASTERS_LIST}`,
		component: MastersList,
	},
	ADMIN_MASTER_CONTROLLER: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.MASTER_CONTROLLER}/:${PARAM.MASTER_ID}?/:${PARAM.MASTER_NAME}?`,
		component: MasterController,
	},
	ADMIN_USERS_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.USERS_LIST}`,
		component: UsersList,
	},
	ADMIN_USER_CONTROLLER: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.USER_CONTROLLER}/:${PARAM.USER_ID}?/:${PARAM.USER_NAME}?/:${PARAM.USER_EMAIL}?`,
		component: UserController,
	},
	ADMIN_CITIES_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.CITIES_LIST}`,
		component: CitiesList,
	},
	ADMIN_CITY_CONTROLLER: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.CITY_CONTROLER}/:${PARAM.CITY_ID}?/:${PARAM.CITY_NAME}?`,
		component: CityController,
	},
	ADMIN_ORDERS_LIST: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`,
		component: OrdersList,
	},
	ADMIN_ORDER_CONTROLLER: {
		path: `/${RESOURCE.ADMIN}/${RESOURCE.ORDER_CONTROLLER}/:${PARAM.ORDER_ID}?/:${PARAM.USER_ID}?/:${PARAM.CLOCK_ID}?/:${PARAM.CITY_ID}?/:${PARAM.ORDER_DATE}?/:${PARAM.ORDER_TIME}?/:${PARAM.MASTER_ID}?`,
		component: OrderController,
	},
	ADMIN_LOGIN: {
		path: `/${RESOURCE.LOGIN}`,
		component: LoginForm,
	},
	RATE_ORDER: {
		path: `/${RESOURCE.RATE}/:${PARAM.RATING_ID}?`,
		component: RateOrder,
	},

};


function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route {...ROUTES.ORDER_FORM}/>
				<Route {...ROUTES.ADMIN_LOGIN}/>
				<Route {...ROUTES.RATE_ORDER}/>
				<PrivatRoute {...ROUTES.ADMIN_MASTERS_LIST}/>
				<PrivatRoute {...ROUTES.ADMIN_MASTER_CONTROLLER}/>
				<PrivatRoute {...ROUTES.ADMIN_USERS_LIST}/>
				<PrivatRoute {...ROUTES.ADMIN_USER_CONTROLLER}/>
				<PrivatRoute {...ROUTES.ADMIN_CITIES_LIST}/>
				<PrivatRoute {...ROUTES.ADMIN_CITY_CONTROLLER}/>
				<PrivatRoute {...ROUTES.ADMIN_ORDERS_LIST}/>
				<PrivatRoute {...ROUTES.ADMIN_ORDER_CONTROLLER}/>
			</Switch>
		</BrowserRouter>

	);
}

export default App;
