import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import UsersList from './UsersList';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithRouter} from '../../../../data/constants/test-utilities';

const usersForTable = [{
	id: '5b512492-ece8-48f4-9b8e-ce34dff6f87b',
	name: 'Stepan',
	email: 'admin@test.com',
}, {
	id: 'b74114b7-8289-4510-bd8a-991d3e385df3',
	name: 'Alex',
	email: 'alexTest@gmail.com',
}, {
	id: 'c94ed1f3-1bcd-46a5-ada5-b6e1dcb6b23d',
	name: 'Andrii Mokin',
	email: 'andrii.mokin@clockwise.software',
}, {
	id: 'ebf6ed6f-6464-473c-8a40-a48878041655',
	name: 'IlliaR',
	email: 'illia.rybachuk@clockwise.software',
}, {
	id: 'abc7a6f-3232-483a-8a40-a54498041734',
	name: 'User Test',
	email: 'userTest@gmail.com',
}];

describe('Users List', () => {
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
		mockAxios.onGet(URL.USER).reply(200, {count: usersForTable.length, rows: usersForTable});

		const {asFragment} = renderWithRouter({
			component: <UsersList />,
			path: '/admin/users-list',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component with empty list', async () => {
		mockAxios.onGet(URL.CITY).reply(200, {count: 0, rows: []});

		const {getByTestId} = renderWithRouter({
			component: <UsersList />,
			path: '/admin/users-list',
		});

		await waitFor(() => {
			expect(getByTestId('no-users-label')).toBeInTheDocument();
		});
	});

	it('should render component with data, delete city', async () => {
		mockAxios.onGet(URL.USER).reply(200, {count: usersForTable.length, rows: usersForTable});
		mockAxios.onDelete(URL.USER).reply(204);

		const {getAllByTestId, findAllByTestId} = renderWithRouter({
			component: <UsersList />,
			path: '/admin/users-list',
		});

		await waitFor(() => {
			expect(getAllByTestId('users-list-row').length).toBe(5);
		});

		const deleteButtons = await findAllByTestId('delete-list-button');
		fireEvent.click(deleteButtons[0]);

		await waitFor(() => {
			expect(mockAxios.history.delete.length).toBe(1);
			expect(mockAxios.history.delete[0].data).toBe(JSON.stringify({
				id: '5b512492-ece8-48f4-9b8e-ce34dff6f87b',
			}));
		});
	});
});

