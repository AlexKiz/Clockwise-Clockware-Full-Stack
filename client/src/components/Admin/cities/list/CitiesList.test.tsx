import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import CitiesList from './CitiesList';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithRouter} from '../../../../data/constants/test-utilities';

const citiesForTable = [{
	id: 1, name: 'Dnipro',
}, {
	id: 3, name: 'Kiev',
}, {
	id: 4, name: 'Harkiv',
}, {
	id: 5, name: 'Uzhorod',
}, {
	id: 6, name: 'New York',
}];

describe('Cities List', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		window.confirm = jest.fn(() => true);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		mockAxios.onGet(URL.CITY).reply(200, {count: citiesForTable.length, rows: citiesForTable});

		const {asFragment} = renderWithRouter({
			component: <CitiesList />,
			path: '/admin/cities-list',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component with empty list', async () => {
		mockAxios.onGet(URL.CITY).reply(200, {count: 0, rows: []});

		const {getByTestId} = renderWithRouter({
			component: <CitiesList />,
			path: '/admin/cities-list',
		});

		await waitFor(() => {
			expect(getByTestId('no-cities-label')).toBeInTheDocument();
		});
	});

	it('should render component with data, delete city', async () => {
		mockAxios.onGet(URL.CITY).reply(200, {count: citiesForTable.length, rows: citiesForTable});
		mockAxios.onDelete(URL.CITY).reply(204);

		const {getAllByTestId, findAllByTestId} = renderWithRouter({
			component: <CitiesList />,
			path: '/admin/cities-list',
		});

		await waitFor(() => {
			expect(getAllByTestId('cities-list-row').length).toBe(5);
		});

		const deleteButtons = await findAllByTestId('delete-list-button');
		fireEvent.click(deleteButtons[0]);

		await waitFor(() => {
			expect(mockAxios.history.delete.length).toBe(1);
			expect(mockAxios.history.delete[0].data).toBe(JSON.stringify({
				id: 1,
			}));
		});
	});
});

