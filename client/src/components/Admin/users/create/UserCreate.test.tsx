import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import UserCreate from './UserCreate';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithRouter, renderWithRouterAndParams} from '../../../../data/constants/test-utilities';

describe('User Create', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		mockAxios.onPut(URL.USER).reply(200);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		const {asFragment} = renderWithRouter({
			component: <UserCreate />,
			path: '/admin/user-create',
		});
		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render update component', async () => {
		const {getByTestId} = renderWithRouterAndParams({
			component: <UserCreate />,
			pathWithParamValue: '/admin/user-create/5b512492-ece8-48f4-9b8e-ce34dff6f87b/Stepan/Bandera@test.com',
			pathWithParamName: '/admin/user-create/:userIdParam/:userNameParam/:userEmailParam',
		});

		await waitFor(() => {
			expect((getByTestId('user-name-input') as HTMLInputElement).value).toBe('Stepan');
			expect((getByTestId('user-email-input') as HTMLInputElement).value).toBe('Bandera@test.com');
		});
	});

	it('should update fetched user', async () => {
		const {getByTestId} = renderWithRouterAndParams({
			component: <UserCreate />,
			pathWithParamValue: '/admin/user-create/5b512492-ece8-48f4-9b8e-ce34dff6f87b/Stepan/Bandera@test.com',
			pathWithParamName: '/admin/user-create/:userIdParam/:userNameParam/:userEmailParam',
		});

		fireEvent.change(getByTestId('user-name-input'), {
			target: {value: 'Antonio'},
		});

		fireEvent.change(getByTestId('user-email-input'), {
			target: {value: 'Banderas@gmail.com'},
		});

		fireEvent.click(getByTestId('user-form-submit'));

		await waitFor(() => {
			expect((getByTestId('user-name-input') as HTMLInputElement).value).toBe('Antonio');
			expect((getByTestId('user-email-input') as HTMLInputElement).value).toBe('Banderas@gmail.com');
		});

		expect(mockAxios.history.put.length).toBe(1);
		expect(mockAxios.history.put[0].data).toBe(JSON.stringify({
			id: '5b512492-ece8-48f4-9b8e-ce34dff6f87b',
			name: 'Antonio',
			email: 'Banderas@gmail.com',
		}));
	});
});
