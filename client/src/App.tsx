/* eslint-disable require-jsdoc */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-len */
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import OrderForm from './components/Order/order.form/OrderForm';
import MastersList from './components/Admin/masters/master.list/MastersList';
import MasterCreate from './components/Admin/masters/master.create/MasterCreate';
import UsersList from './components/Admin/users/user.list/UsersList';
import UserCreate from './components/Admin/users/user.create/UserCreate';
import CitiesList from './components/Admin/cities/cities.list/CitiesList';
import CityCreate from './components/Admin/cities/city.create/CityCreate';
import OrdersList from './components/Admin/orders/orders.list/OrdersList';
import OrderCreate from './components/Admin/orders/order.create/OrderCreate';
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
				<PrivateRoute component={MasterCreate} {...ROUTES.ADMIN_MASTER_CREATE}/>
				<PrivateRoute component={UsersList} {...ROUTES.ADMIN_USERS_LIST}/>
				<PrivateRoute component={UserCreate} {...ROUTES.ADMIN_USER_CREATE}/>
				<PrivateRoute component={CitiesList} {...ROUTES.ADMIN_CITIES_LIST}/>
				<PrivateRoute component={CityCreate} {...ROUTES.ADMIN_CITY_CREATE}/>
				<PrivateRoute component={OrdersList} {...ROUTES.ADMIN_ORDERS_LIST}/>
				<PrivateRoute component={OrderCreate} {...ROUTES.ADMIN_ORDER_CREATE}/>
			</Switch>
		</BrowserRouter>

	);
}

export default App;
