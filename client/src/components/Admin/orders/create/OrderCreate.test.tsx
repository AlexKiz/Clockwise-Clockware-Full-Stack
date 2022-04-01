import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import OrderCreate from './OrderCreate';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithRouterAndParams} from '../../../../data/constants/test-utilities';

const fetchedOrder = {
	id: '3419af42-d761-4370-bfbc-59366dba529b',
	startWorkOn: '2022-03-07T13:00:00.000Z',
	endWorkOn: '2022-03-07T16:00:00.000Z',
	clock: {
		id: 3,
		size: 'Large',
	},
	user: {
		id: '5b512492-ece8-48f4-9b8e-ce34dff6f87b',
		name: 'Stepan',
		email: 'stepFes@test.com',
	},
	city: {
		id: 1,
		name: 'Dnipro',
	},
	master: {
		id: 'dce55acd-b552-458b-85b5-785e821b336c',
		name: 'Valera',
	},
};

const cities = [{
	id: 1, name: 'Dnipro',
}, {
	id: 2, name: 'Uzgorod',
}, {
	id: 3, name: 'Odessa',
}];

const users = [{
	id: 'ebf6ed6f-6464-473c-8a40-a48878041655',
	name: 'IlliaR',
	email: 'illia.rybachuk@clockwise.software',
}, {
	id: '5b512492-ece8-48f4-9b8e-ce34dff6f87b',
	name: 'Stepan',
	email: 'stepFes@test.com',
}, {
	id: 'b74114b7-8289-4510-bd8a-991d3e385df3',
	name: 'User Test',
	email: 'userTest@gmail.com',
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
}];

describe('Order Create', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		mockAxios.onPut(URL.ORDER).reply(200);
		mockAxios.onGet(URL.ORDER_FOR_UPDATE).reply(200, fetchedOrder);
		mockAxios.onGet(URL.USER).reply(200, users);
		mockAxios.onGet(URL.CLOCK).reply(200, clocks);
		mockAxios.onGet(URL.CITY).reply(200, cities);
		mockAxios.onGet(URL.AVAILABLE_MASTER).reply(200, availableMasters);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('should matches snapshot', async () => {
		const {asFragment} = renderWithRouterAndParams({
			component: <OrderCreate />,
			pathWithParamValue: '/admin/order-create/3419af42-d761-4370-bfbc-59366dba529b',
			pathWithParamName: '/admin/order-create/:orderIdParam',
		});
		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render update component', async () => {
		const {getByTestId} = renderWithRouterAndParams({
			component: <OrderCreate />,
			pathWithParamValue: '/admin/order-create/3419af42-d761-4370-bfbc-59366dba529b',
			pathWithParamName: '/admin/order-create/:orderIdParam',
		});

		await waitFor(() => {
			expect((getByTestId('order-user-select') as HTMLInputElement).value).toBe('5b512492-ece8-48f4-9b8e-ce34dff6f87b');
			expect((getByTestId('order-clock-select') as HTMLInputElement).value).toBe('3');
			expect((getByTestId('order-city-select') as HTMLInputElement).value).toBe('1');
			expect((getByTestId('order-date-input') as HTMLInputElement).value).toBe('2022-03-07');
			expect((getByTestId('order-time-select') as HTMLInputElement).value).toBe('13:00');
			expect((getByTestId('order-master-select') as HTMLInputElement).value).toBe('dce55acd-b552-458b-85b5-785e821b336c');
		});
	});

	it('should update fetched user', async () => {
		const {getByTestId, getByLabelText, findByText} = renderWithRouterAndParams({
			component: <OrderCreate />,
			pathWithParamValue: '/admin/order-create/3419af42-d761-4370-bfbc-59366dba529b',
			pathWithParamName: '/admin/order-create/:orderIdParam',
		});

		fireEvent.mouseDown(getByLabelText('User'));
		const choosenUserOption = await findByText(/IlliaR/i);
		fireEvent.click(choosenUserOption);

		fireEvent.mouseDown(getByLabelText('Size'));
		const choosenClockOption = await findByText(/Medium/i);
		fireEvent.click(choosenClockOption);

		fireEvent.mouseDown(getByLabelText('City'));
		const choosenCityOption = await findByText(/Uzgorod/i);
		fireEvent.click(choosenCityOption);

		fireEvent.change(getByTestId('order-time-select'), {
			target: {value: '10:00'},
		});

		fireEvent.change(getByTestId('order-date-input'), {
			target: {value: '2023-03-23'},
		});

		fireEvent.mouseDown(getByLabelText('Choose the master'));
		const choosenMasterOption = await findByText(/Super Master/i);
		fireEvent.click(choosenMasterOption);

		fireEvent.click(getByTestId('order-submit-button'));

		await waitFor(() => {
			expect((getByTestId('order-user-select') as HTMLInputElement).value).toBe('ebf6ed6f-6464-473c-8a40-a48878041655');
			expect((getByTestId('order-clock-select') as HTMLInputElement).value).toBe('2');
			expect((getByTestId('order-city-select') as HTMLInputElement).value).toBe('2');
			expect((getByTestId('order-date-input') as HTMLInputElement).value).toBe('2023-03-23');
			expect((getByTestId('order-time-select') as HTMLInputElement).value).toBe('10:00');
			expect((getByTestId('order-master-select') as HTMLInputElement).value).toBe('8f12fab3-5dd6-4a0b-adb2-284766f7a2ce');
		});

		expect(mockAxios.history.put.length).toBe(1);
		expect(mockAxios.history.put[0].data).toBe(JSON.stringify({
			id: '3419af42-d761-4370-bfbc-59366dba529b',
			clockId: 2,
			userId: 'ebf6ed6f-6464-473c-8a40-a48878041655',
			cityId: 2,
			masterId: '8f12fab3-5dd6-4a0b-adb2-284766f7a2ce',
			startWorkOn: '2023-03-23T10:00:00.000Z',
			endWorkOn: '2023-03-23T12:00:00.000Z',
		}));
	});
});
