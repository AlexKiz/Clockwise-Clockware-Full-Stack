import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';


export const renderWithRouter = ({component, path, exact = false}) => (
	render(
		<MemoryRouter initialEntries={[path]}>
			<Route path={`${path}`} exact={exact}>
				{component}
			</Route>
		</MemoryRouter>,
	)
);

export const rerenderWrapper = ({component, path, exact = false}) => {
	return (
		<MemoryRouter initialEntries={[path]}>
			<Route path={`${path}`} exact={exact}>
				{component}
			</Route>
		</MemoryRouter>
	);
};

export * from '@testing-library/react';
