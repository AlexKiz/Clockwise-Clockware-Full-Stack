import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios'
import { access } from 'fs';

axios.defaults.baseURL = process.env.REACT_APP_API_URL

axios.interceptors.request.use(
  config => {
    
    const accessToken = localStorage.getItem('accessToken')

    if(accessToken) { 

      config.headers.Authorization = `Bearer ${accessToken}`

    }

    return config

  }, error => {

    Promise.reject(error);

    }
  );


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


reportWebVitals();
