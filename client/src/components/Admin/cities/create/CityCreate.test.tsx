import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import CityCreate from './CityCreate';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithRouter, renderWithRouterAndParams} from '../../../../data/constants/test-utilities';

const cityForUpdate = {
	id: 1,
	name: 'Dnipro',
};

describe('City Create', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		mockAxios.onGet(URL.CITY_FOR_UPDATE).reply(200, cityForUpdate);
		mockAxios.onPut(URL.CITY).reply(200);
		mockAxios.onPost(URL.CITY).reply(201);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		const {asFragment} = renderWithRouter({
			component: <CityCreate />,
			path: '/admin/city-create',
		});
		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render update component', async () => {
		const {getByTestId} = renderWithRouterAndParams({
			component: <CityCreate />,
			pathWithParamValue: '/admin/city-create/Dnipro',
			pathWithParamName: '/admin/city-create/:cityNameParam',
		});

		await waitFor(() => {
			expect((getByTestId('city-name-input') as HTMLInputElement).value).toBe('Dnipro');
		});
	});

	it('should update fetched city', async () => {
		const {getByTestId} = renderWithRouterAndParams({
			component: <CityCreate />,
			pathWithParamValue: '/admin/city-create/Dnipro',
			pathWithParamName: '/admin/city-create/:cityNameParam',
		});

		fireEvent.change(getByTestId('city-name-input'), {
			target: {value: 'Harkiv'},
		});

		fireEvent.click(getByTestId('city-form-submit'));

		await waitFor(() => {
			expect((getByTestId('city-name-input') as HTMLInputElement).value).toBe('Harkiv');
		});
		expect(mockAxios.history.put.length).toBe(1);
		expect(mockAxios.history.put[0].data).toBe(JSON.stringify({
			id: 1,
			name: 'Harkiv',
		}));
	});

	it('should render create component with empty values', async () => {
		const {getByTestId} = renderWithRouter({
			component: <CityCreate />,
			path: '/admin/city-create',
		});

		await waitFor(() => {
			expect((getByTestId('city-name-input') as HTMLInputElement).value).toBe('');
		});
	});

	it('should triggers event handlers on UI elements, post city on submit', async () => {
		const {getByTestId} = renderWithRouter({
			component: <CityCreate />,
			path: '/admin/city-create',
		});

		fireEvent.change(getByTestId('city-name-input'), {
			target: {value: 'Harkiv'},
		});

		fireEvent.click(getByTestId('city-form-submit'));

		await waitFor(() => {
			expect((getByTestId('city-name-input') as HTMLInputElement).value).toBe('Harkiv');
		});
		expect(mockAxios.history.post.length).toBe(1);
		expect(mockAxios.history.post[0].data).toBe(JSON.stringify({
			name: 'Harkiv',
		}));
	});
});
