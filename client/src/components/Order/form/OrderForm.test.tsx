/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import OrderForm from './OrderForm';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../data/constants/routeConstants';
import {renderWithRouter} from '../../../data/constants/test-utilities';

const cityForOrder = [{
	id: 1,
	name: 'Dnipro',
}, {
	id: 2,
	name: 'Uzgorod',
}, {
	id: 3,
	name: 'Odessa',
}];

const clocks = [{
	id: 1,
	size: 'Small',
	price: 1,
	installationTime: 1,
}, {
	id: 2,
	size: 'Medium',
	price: 2,
	installationTime: 2,
}, {
	id: 3,
	size: 'Large',
	price: 3,
	installationTime: 3,
}];

const availableMasters = [{
	id: '8f12fab3-5dd6-4a0b-adb2-284766f7a2ce',
	name: 'Super Master',
	rating: 0,
}, {
	id: 'dce55acd-b552-458b-85b5-785e821b336c',
	name: 'Valera',
	rating: 0,
}, {
	id: '234eaf37-740a-47c7-80fe-3a5051dc356b',
	name: 'Master Rybachuk',
	rating: 5,
}];

describe('Order Form', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			...jest.requireActual('react-router-dom'),
			useLocation: () => ({
				pathname: '/',
			}),
		}));
		jest.mock('react-i18next', () => ({
			useTranslation: () => {
				return {
					t: (str) => str,
					i18n: {
						changeLanguage: () => new Promise(() => {}),
					},
				};
			},
		}));
		mockAxios.onGet(URL.CITY_FOR_ORDER).reply(200, cityForOrder);
		mockAxios.onGet(URL.CLOCK).reply(200, clocks);
		mockAxios.onGet(URL.AVAILABLE_MASTER).reply(200, availableMasters);
		mockAxios.onPost(URL.STRIPE).reply(201, 'https://www.google.com.ua/');
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});


	it('matches snapshot', async () => {
		const {asFragment} = renderWithRouter({
			component: <OrderForm />,
			path: '/',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component with empty values', async () => {
		const {getByTestId} = renderWithRouter({
			component: <OrderForm />,
			path: '/',
		});

		await waitFor(() => {
			expect((getByTestId('user-name-input') as HTMLInputElement).value).toBe('');
			expect((getByTestId('user-email-input') as HTMLInputElement).value).toBe('');
			expect((getByTestId('clock-size-select') as HTMLInputElement).value).toBe('');
			expect((getByTestId('order-city-select') as HTMLInputElement).value).toBe('');
			expect((getByTestId('order-date-input') as HTMLInputElement).value).toBe('');
			expect((getByTestId('order-time-select') as HTMLInputElement).value).toBe('');
			expect((getByTestId('order-master-select') as HTMLInputElement).value).toBe('');
		});
	});

	it('should triggers event handlers on UI elements, post order on submit', async () => {
		const {getByTestId, findByText, getByLabelText} = renderWithRouter({
			component: <OrderForm />,
			path: '/',
		});

		fireEvent.change(getByTestId('user-name-input'), {
			target: {value: 'Test Name'},
		});
		fireEvent.change(getByTestId('user-email-input'), {
			target: {value: 'testEmail@gmail.com'},
		});

		fireEvent.mouseDown(getByLabelText('Size'));
		const choosenClockOption = await findByText('Small');
		fireEvent.click(choosenClockOption);

		fireEvent.mouseDown(getByLabelText('City'));
		const choosenCityOption = await findByText('Odessa');
		fireEvent.click(choosenCityOption);

		fireEvent.change(getByTestId('order-date-input'), {
			target: {value: '2024-03-23'},
		});
		fireEvent.change(getByTestId('order-time-select'), {
			target: {value: '09:00'},
		});

		fireEvent.mouseDown(getByLabelText('Choose the master'));
		const choosenMasterOption = await findByText(/Valera/i);
		fireEvent.click(choosenMasterOption);

		fireEvent.click(getByTestId('order-submit-button'));

		await waitFor(() => {
			expect((getByTestId('user-name-input') as HTMLInputElement).value).toBe('Test Name');
			expect((getByTestId('user-email-input') as HTMLInputElement).value).toBe('testEmail@gmail.com');
			expect((getByTestId('clock-size-select') as HTMLInputElement).value).toBe('1');
			expect((getByTestId('order-city-select') as HTMLInputElement).value).toBe('3');
			expect((getByTestId('order-date-input') as HTMLInputElement).value).toBe('2024-03-23');
			expect((getByTestId('order-time-select') as HTMLInputElement).value).toBe('09:00');
			expect((getByTestId('order-master-select') as HTMLInputElement).value).toBe('dce55acd-b552-458b-85b5-785e821b336c');
			expect(mockAxios.history.post.length).toBe(1);
			expect(mockAxios.history.post[0].data).toBe(JSON.stringify({
				name: 'Test Name',
				email: 'testEmail@gmail.com',
				clockId: 1,
				clockSize: 'Small',
				price: 1,
				cityId: 3,
				masterId: 'dce55acd-b552-458b-85b5-785e821b336c',
				startWorkOn: '2024-03-23T09:00:00.000Z',
				endWorkOn: '2024-03-23T10:00:00.000Z',
				orderPhotos: [],
				orderAddress: null,
			}));
		});
	});
});
