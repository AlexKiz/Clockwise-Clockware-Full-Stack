import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import {store} from '../../store/index';
import {rootReducer} from 'src/store/reducers';
import thunk from 'redux-thunk';

export const renderWithRouter = ({component, path}) => (
	render(
		<MemoryRouter initialEntries={[path]}>
			<Route path={`${path}`}>
				{component}
			</Route>
		</MemoryRouter>,
	)
);

export const renderWithRouterAndParams = ({component, pathWithParamValue, pathWithParamName}) => (
	render(
		<MemoryRouter initialEntries={[pathWithParamValue]}>
			<Route path={`${pathWithParamName}`}>
				{component}
			</Route>
		</MemoryRouter>,
	)
);

export const rerenderWrapper = ({component, pathWithParamValue, pathWithParamName}) => {
	return (
		<MemoryRouter initialEntries={[pathWithParamValue]}>
			<Route path={`${pathWithParamName}`}>
				{component}
			</Route>
		</MemoryRouter>
	);
};

export const renderWithReduxAndRouter = ({component, path, store}) => {
	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={[path]}>
				<Route path={`${path}`}>
					{component}
				</Route>
			</MemoryRouter>,
		</Provider>,
	);
};

export * from '@testing-library/react';
