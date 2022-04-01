import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MasterCreate from './MasterCreate';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithRouter, renderWithRouterAndParams} from '../../../../data/constants/test-utilities';

const masters = [{
	id: '8f12fab3-5dd6-4a0b-adb2-284766f7a2ce',
	name: 'Super Master',
	rating: 0,
	cities: [{id: 2, name: 'Uzgorod'}, {id: 1, name: 'Dnipro'}],
}, {
	id: '85a1abd5-aa95-4cc7-bdaf-bfdca9e2a67d',
	name: 'Time God',
	rating: 0,
	cities: [{id: 2, name: 'Uzgorod'}],
}, {
	id: 'dce55acd-b552-458b-85b5-785e821b336c',
	name: 'Valera',
	rating: 0,
	cities: [{id: 1, name: 'Dnipro'}],
}, {
	id: '52cb872f-579b-419c-b092-997a4473d59f',
	name: 'Rahmed',
	rating: 0,
	cities: [{id: 2, name: 'Uzgorod'}],
}, {
	id: '234eaf37-740a-47c7-80fe-3a5051dc356b',
	name: 'Master Rybachuk',
	rating: 5,
	cities: [{id: 1, name: 'Dnipro'}, {id: 2, name: 'Uzgorod'}, {id: 3, name: 'Odessa'}],
}];

const cities = [{
	id: 1, name: 'Dnipro',
}, {
	id: 2, name: 'Uzgorod',
}, {
	id: 3, name: 'Odessa',
}];

describe('Master Create', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		mockAxios.onGet(URL.MASTER).reply(200, masters);
		mockAxios.onGet(URL.CITY).reply(200, cities);
		mockAxios.onPut(URL.MASTER).reply(200);
		mockAxios.onPost(URL.MASTER).reply(201);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		const {asFragment} = renderWithRouter({
			component: <MasterCreate />,
			path: '/admin/master-create',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render update component', async () => {
		const {getByTestId} = renderWithRouterAndParams({
			component: <MasterCreate />,
			pathWithParamValue: '/admin/master-create/dce55acd-b552-458b-85b5-785e821b336c/Valera',
			pathWithParamName: '/admin/master-create/:masterIdParam?/:masterNameParam',
		});

		await waitFor(() => {
			expect((getByTestId('master-name-input') as HTMLInputElement).value).toBe('Valera');
			expect((getByTestId('master-cities-select') as HTMLInputElement).value).toBe('1');
		});
	});

	it('should update fetched master', async () => {
		const {getByTestId, getByLabelText, findByText} = renderWithRouterAndParams({
			component: <MasterCreate />,
			pathWithParamValue: '/admin/master-create/dce55acd-b552-458b-85b5-785e821b336c/Valera',
			pathWithParamName: '/admin/master-create/:masterIdParam/:masterNameParam',
		});

		fireEvent.change(getByTestId('master-name-input'), {
			target: {value: 'Valera Beast'},
		});

		fireEvent.mouseDown(getByLabelText('Cities'));
		const choosenMasterCitiesOption = await findByText(/Uzgorod/i);
		fireEvent.click(choosenMasterCitiesOption);

		fireEvent.click(getByTestId('master-form-submit'));


		await waitFor(() => {
			expect((getByTestId('master-name-input') as HTMLInputElement).value).toBe('Valera Beast');
			expect((getByTestId('master-cities-select') as HTMLInputElement).value).toBe('1,2');
		});
		expect(mockAxios.history.put.length).toBe(1);
		expect(mockAxios.history.put[0].data).toBe(JSON.stringify({
			id: 'dce55acd-b552-458b-85b5-785e821b336c',
			name: 'Valera Beast',
			citiesId: [1, 2],
		}));
	});

	it('should render create component with empty values', async () => {
		const {getByTestId} = renderWithRouter({
			component: <MasterCreate />,
			path: '/admin/master-create',
		});

		await waitFor(() => {
			expect((getByTestId('master-name-input') as HTMLInputElement).value).toBe('');
			expect((getByTestId('master-cities-select') as HTMLInputElement).value).toBe('');
		});
	});

	it('should triggers event handlers on UI elements, post city on submit', async () => {
		const {getByTestId, getByLabelText, findByText} = renderWithRouter({
			component: <MasterCreate />,
			path: '/admin/master-create',
		});

		fireEvent.change(getByTestId('master-name-input'), {
			target: {value: 'Master Test'},
		});

		fireEvent.mouseDown(getByLabelText('Cities'));
		const choosenMasterOptionDnipro = await findByText(/Dnipro/i);
		const choosenMasterOptionOdessa = await findByText(/Odessa/i);
		fireEvent.click(choosenMasterOptionDnipro);
		fireEvent.click(choosenMasterOptionOdessa);

		fireEvent.click(getByTestId('master-form-submit'));

		await waitFor(() => {
			expect((getByTestId('master-name-input') as HTMLInputElement).value).toBe('Master Test');
			expect((getByTestId('master-cities-select') as HTMLInputElement).value).toBe('1,3');
		});
		expect(mockAxios.history.post.length).toBe(1);
		expect(mockAxios.history.post[0].data).toBe(JSON.stringify({
			name: 'Master Test',
			citiesId: [1, 3],
		}));
	});
});
