import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import OrderForm from './components/Order/OrderForm';
import MastersList from './components/Admin/master.list/MastersList';
import MasterController from './components/Admin/master.controller/MasterController';
import UsersList from './components/Admin/user.list/UsersList';
import UserController from './components/Admin/user.controller/UserController';
import CitiesList from './components/Admin/cities.list/CitiesList';
import CityController from './components/Admin/city.controller/CityController';
import OrdersList from './components/Admin/orders.list/OrdersList';
import OrderController from './components/Admin/order.controller/OrderController';
import LoginForm from './components/Admin/login/LoginForm';
import PrivatRoute from './PrivatRoute';
import RateOrder from './components/RateOrder/RateOrder'


const ROUTES = {
  ORDER_FORM: {
    path: "/" ,
    exact: true,
    component: OrderForm
  },
  ADMIN_MASTERS_LIST: {
    path:"/admin/masters-list",
    component: MastersList
  },
  ADMIN_MASTER_CONTROLLER: {
    path: "/admin/master-controller/:propsMasterId?/:propsMasterName?",
    component: MasterController
  },
  ADMIN_USERS_LIST: {
    path: "/admin/users-list",
    component: UsersList
  }, 
  ADMIN_USER_CONTROLLER: {
    path: "/admin/user-controller/:propsUserId?/:propsUserName?/:propsUserEmail?",
    component: UserController
  },
  ADMIN_CITIES_LIST: {
    path: "/admin/cities-list",
    component: CitiesList
  },
  ADMIN_CITY_CONTROLLER: {
    path: "/admin/city-controller/:propsCityId?/:propsCityName?",
    component: CityController
  },
  ADMIN_ORDERS_LIST: {
    path:"/admin/orders-list",
    component: OrdersList
  },
  ADMIN_ORDER_CONTROLLER: {
    path: "/admin/order-controller/:propsOrderId?/:propsUserId?/:propsClockId?/:propsCityId?/:propsOrderDate?/:propsOrderTime?/:propsMasterId?",
    component: OrderController
  },
  ADMIN_LOGIN: {
    path:"/login",
    component: LoginForm
  },
  RATE_ORDER: {
    path:"/rate/:ratingIdentificator?",
    component: RateOrder
  }
  
} 


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
