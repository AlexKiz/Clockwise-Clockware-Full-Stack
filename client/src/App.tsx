import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import OrderForm from './components/Order/form/OrderForm';
import MastersList from './components/Admin/masters/list/MastersList';
import MasterCreate from './components/Admin/masters/create/MasterCreate';
import UsersList from './components/Admin/users/list/UsersList';
import UserCreate from './components/Admin/users/create/UserCreate';
import CitiesList from './components/Admin/cities/list/CitiesList';
import CityCreate from './components/Admin/cities/create/CityCreate';
import OrdersList from './components/Admin/orders/list/OrdersList';
import OrderCreate from './components/Admin/orders/create/OrderCreate';
import LoginForm from './components/Login/form/LoginForm';
import PrivateRoute from './components/Route/PrivateRoute';
import RateOrder from './components/Order/rate/RateOrder';
import Registration from './components/Admin/users/registration/Registration';
import {ROUTES} from './data/constants/routeConstants';
import Verification from './components/Admin/users/verification/Verification';
import MasterOrdersList from './components/Master/orders/list/MasterOrdersList';
import ClientOrdersList from './components/Client/order/list/ClientOrdersList';
import Statistics from './components/Admin/statistics/Statistics';
import Blog from './components/Blog/Blog';


const App = () => (
	<BrowserRouter>
		<Switch>
			<Route component={OrderForm} {...ROUTES.ORDER_FORM}/>
			<Route component={LoginForm} {...ROUTES.LOGIN}/>
			<Route component={RateOrder} {...ROUTES.RATE_ORDER}/>
			<Route component={Registration} {...ROUTES.REGISTRATION}/>
			<Route component={Verification} {...ROUTES.USER_VERIFY}/>
			<Route component={Blog} {...ROUTES.BLOG}/>
			<PrivateRoute component={MastersList} {...ROUTES.ADMIN_MASTERS_LIST}/>
			<PrivateRoute component={MasterCreate} {...ROUTES.ADMIN_MASTER_CREATE}/>
			<PrivateRoute component={UsersList} {...ROUTES.ADMIN_USERS_LIST}/>
			<PrivateRoute component={UserCreate} {...ROUTES.ADMIN_USER_CREATE}/>
			<PrivateRoute component={CitiesList} {...ROUTES.ADMIN_CITIES_LIST}/>
			<PrivateRoute component={CityCreate} {...ROUTES.ADMIN_CITY_CREATE}/>
			<PrivateRoute component={OrdersList} {...ROUTES.ADMIN_ORDERS_LIST}/>
			<PrivateRoute component={OrderCreate} {...ROUTES.ADMIN_ORDER_CREATE}/>
			<PrivateRoute component={Statistics} {...ROUTES.ADMIN_STATISTICS}/>
			<PrivateRoute component={MasterOrdersList} {...ROUTES.MASTER_ORDERS_LIST}/>
			<PrivateRoute component={ClientOrdersList} {...ROUTES.CLIENT_ORDERS_LIST}/>
		</Switch>
	</BrowserRouter>
);

export default App;
