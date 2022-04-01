import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MastersList from './MastersList';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithRouter} from '../../../../data/constants/test-utilities';

const mastersForTable = [{
	cities: [{id: 1, name: 'Dnipro'}, {id: 2, name: 'Uzgorod'}, {id: 3, name: 'Odessa'}],
	id: '234eaf37-740a-47c7-80fe-3a5051dc356b',
	name: 'Master Rybachuk',
	rating: 5,
}, {
	cities: [{id: 2, name: 'Uzgorod'}],
	id: '52cb872f-579b-419c-b092-997a4473d59f',
	name: 'Rahmed',
	rating: 0,
}, {
	cities: [{id: 2, name: 'Uzgorod'}],
	id: '85a1abd5-aa95-4cc7-bdaf-bfdca9e2a67d',
	name: 'Time God',
	rating: 0,
}, {
	cities: [{id: 2, name: 'Uzgorod'}, {id: 1, name: 'Dnipro'}],
	id: '8f12fab3-5dd6-4a0b-adb2-284766f7a2ce',
	name: 'Super Master',
	rating: 0,
}, {
	cities: [{id: 1, name: 'Dnipro'}],
	id: 'dce55acd-b552-458b-85b5-785e821b336c',
	name: 'Valera',
	rating: 0,
}];

describe('Masters List', () => {
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
		mockAxios.onGet(URL.CITY).reply(200, {count: mastersForTable.length, rows: mastersForTable});

		const {asFragment} = renderWithRouter({
			component: <MastersList />,
			path: '/admin/masters-list',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component with empty list', async () => {
		mockAxios.onGet(URL.MASTER).reply(200, {count: 0, rows: []});

		const {getByTestId} = renderWithRouter({
			component: <MastersList />,
			path: '/admin/masters-list',
		});

		await waitFor(() => {
			expect(getByTestId('no-masters-label')).toBeInTheDocument();
		});
	});

	it('should render component with data, delete city', async () => {
		mockAxios.onGet(URL.MASTER).reply(200, {count: mastersForTable.length, rows: mastersForTable});
		mockAxios.onDelete(URL.MASTER).reply(204);

		const {getAllByTestId, findAllByTestId} = renderWithRouter({
			component: <MastersList />,
			path: '/admin/masters-list',
		});

		await waitFor(() => {
			expect(getAllByTestId('masters-list-row').length).toBe(5);
		});

		const deleteButtons = await findAllByTestId('delete-list-button');
		fireEvent.click(deleteButtons[0]);

		await waitFor(() => {
			expect(mockAxios.history.delete.length).toBe(1);
			expect(mockAxios.history.delete[0].data).toBe(JSON.stringify({
				id: '234eaf37-740a-47c7-80fe-3a5051dc356b',
			}));
		});
	});
});

