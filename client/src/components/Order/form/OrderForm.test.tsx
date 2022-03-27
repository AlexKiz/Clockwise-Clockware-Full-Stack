import React from 'react';
import axios from 'axios';
import OrderForm from './OrderForm';
import {fireEvent, act} from '@testing-library/react';
import {URL} from '../../../data/constants/routeConstants';
import {renderWithRouter, rerenderWrapper} from '../../../data/constants/test-utilities';

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

describe('Order Form Component', () => {
	beforeAll(async () => {
		jest.mock('react-router-dom', () => ({
			...jest.requireActual('react-router-dom'),
			useLocation: () => ({
				pathname: '/',
			}),
		}));

		jest.mock('axios');
	});


	it('matches snapshot', () => {
		const {asFragment} = renderWithRouter({
			component: <OrderForm />,
			path: '/',
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it('shows input with empty value', () => {
		const {getByTestId} = renderWithRouter({
			component: <OrderForm />,
			path: '/',
		});
		expect((getByTestId('user-name-input') as HTMLInputElement).value).toBe('');
		expect((getByTestId('user-email-input') as HTMLInputElement).value).toBe('');
		expect((getByTestId('clock-size-select') as HTMLInputElement).value).toBe('');
		expect((getByTestId('order-city-select') as HTMLInputElement).value).toBe('');
		expect((getByTestId('order-date-input') as HTMLInputElement).value).toBe('');
		expect((getByTestId('order-time-select') as HTMLInputElement).value).toBe('');
		expect((getByTestId('order-master-select') as HTMLInputElement).value).toBe('');
	});

	it('triggers event handlers on inputs and selects', async () => {
		const {getByTestId, rerender} = await renderWithRouter({
			component: <OrderForm />,
			path: '/',
			exact: true,
		});

		axios.mockImplementation(async (url) => {
			switch (url) {
			case URL.CITY_FOR_ORDER:
				return Promise.resolve({
					status: 200,
					data: cityForOrder,
				});

			case URL.CLOCK:
				return Promise.resolve({
					status: 200,
					data: clocks,
				});

			case URL.AVAILABLE_MASTER:
				return Promise.resolve({
					status: 200,
					data: availableMasters,
				});
			}
		});
		act(() => {
			fireEvent.change(getByTestId('user-name-input'), {
				target: {value: 'Test Name'},
			});
			fireEvent.change(getByTestId('user-email-input'), {
				target: {value: 'testEmail@gmail.com'},
			});
			fireEvent.change(getByTestId('clock-size-select'), {
				target: {value: 'Small'},
			});
			fireEvent.change(getByTestId('order-city-select'), {
				target: {value: 'Dnipro'},
			});
			fireEvent.change(getByTestId('order-date-input'), {
				target: {value: '2024-03-23T00:00:00.000Z'},
			});
			fireEvent.change(getByTestId('order-time-select'), {
				target: {value: '09:00'},
			});
			fireEvent.change(getByTestId('order-master-select'), {
				target: {value: 'Some Master'},
			});
		});

		await rerender(rerenderWrapper({
			component: <OrderForm/>,
			path: '/',
			exact: true,
		}));

		expect((getByTestId('user-name-input') as HTMLInputElement).value).toBe('Test Name');
		expect((getByTestId('user-email-input') as HTMLInputElement).value).toBe('testEmail@gmail.com');
		// expect((getByTestId('clock-size-select') as HTMLInputElement).value).toBe('Small');
		// expect((getByTestId('order-city-select') as HTMLInputElement).value).toBe('Dnipro');
		expect((getByTestId('order-date-input') as HTMLInputElement).value).toBe('2024-03-23T00:00:00.000Z');
		expect((getByTestId('order-time-select') as HTMLInputElement).value).toBe('09:00');
		expect((getByTestId('order-time-input') as HTMLInputElement).value).toBe('Some Master');
	});
});
