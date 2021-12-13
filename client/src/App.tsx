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
import PrivateRoute from './components/Route/PrivateRoute';
import RateOrder from './components/Order/order.rate/RateOrder';
import {ROUTES} from './data/constants/routeConstants';


function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route component={OrderForm} {...ROUTES.ORDER_FORM}/>
				<Route component={LoginForm} {...ROUTES.ADMIN_LOGIN}/>
				<Route component={RateOrder} {...ROUTES.RATE_ORDER}/>
				<PrivateRoute component={MastersList} {...ROUTES.ADMIN_MASTERS_LIST}/>
				<PrivateRoute component={MasterController} {...ROUTES.ADMIN_MASTER_CONTROLLER}/>
				<PrivateRoute component={UsersList} {...ROUTES.ADMIN_USERS_LIST}/>
				<PrivateRoute component={UserController} {...ROUTES.ADMIN_USER_CONTROLLER}/>
				<PrivateRoute component={CitiesList} {...ROUTES.ADMIN_CITIES_LIST}/>
				<PrivateRoute component={CityController} {...ROUTES.ADMIN_CITY_CONTROLLER}/>
				<PrivateRoute component={OrdersList} {...ROUTES.ADMIN_ORDERS_LIST}/>
				<PrivateRoute component={OrderController} {...ROUTES.ADMIN_ORDER_CONTROLLER}/>
			</Switch>
		</BrowserRouter>

	);
}

export default App;
