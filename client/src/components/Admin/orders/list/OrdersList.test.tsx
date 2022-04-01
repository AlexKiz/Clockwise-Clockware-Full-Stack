import React from 'react';
import OrdersList from './OrdersList';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithReduxAndRouter} from '../../../../data/constants/test-utilities';
import {store} from 'src/store';

const ordersForTable = [{
	city: {id: 2, name: 'Uzgorod'},
	clock: {id: 1, size: 'Small', price: 1},
	endWorkOn: '2022-03-07T16:00:00.000Z',
	id: '2538907c-1d7a-4cac-87ff-b5bf8dd66d5a',
	images: 'http://res.cloudinary.com/dplgyedon/image/upload/v1646587753/h0tdflupaiwidzs9lpyq.png',
	isCompleted: true,
	master: {id: '234eaf37-740a-47c7-80fe-3a5051dc356b', name: 'Master Rybachuk'},
	orderAddress: null,
	paymentDate: '2022-03-06T17:30:40.577Z',
	ratingIdentificator: '8761b70e-9bde-4559-84c5-5f711eb93842',
	startWorkOn: '2022-03-07T15:00:00.000Z',
	user: {
		email: 'illia.rybachuk@clockwise.software',
		id: 'ebf6ed6f-6464-473c-8a40-a48878041655',
		name: 'IlliaR',
	},
}, {
	city: {id: 1, name: 'Dnipro'},
	clock: {id: 3, size: 'Large', price: 3},
	endWorkOn: '2022-03-07T16:00:00.000Z',
	id: '3419af42-d761-4370-bfbc-59366dba529b',
	images: 'http://res.cloudinary.com/dplgyedon/image/upload/v1646586203/yzaoaicnxs9izb9nqwqq.jpg',
	isCompleted: false,
	master: {id: 'dce55acd-b552-458b-85b5-785e821b336c', name: 'Valera'},
	orderAddress: null,
	paymentDate: '2022-03-06T17:03:45.064Z',
	ratingIdentificator: 'df1160de-f3e6-427d-a262-f52c132fdef9',
	startWorkOn: '2022-03-07T13:00:00.000Z',
	user: {id: '5b512492-ece8-48f4-9b8e-ce34dff6f87b', name: 'Stepan', email: 'admin@test.com'},
}, {
	city: {id: 2, name: 'Uzgorod'},
	clock: {id: 2, size: 'Medium', price: 2},
	endWorkOn: '2022-04-07T17:00:00.000Z',
	id: '5323755a-360d-4f57-ab75-3ebf7854ed49',
	images: 'http://res.cloudinary.com/dplgyedon/image/upload/v1646586303/jq2m71vkhb0stkjnx3mb.jpg',
	isCompleted: false,
	master: {id: '52cb872f-579b-419c-b092-997a4473d59f', name: 'Rahmed'},
	orderAddress: null,
	paymentDate: '2022-03-06T17:05:28.830Z',
	ratingIdentificator: '16963ef1-08e1-4eee-9723-9167c0424554',
	startWorkOn: '2022-04-07T15:00:00.000Z',
	user: {id: '5b512492-ece8-48f4-9b8e-ce34dff6f87b', name: 'Stepan', email: 'admin@test.com'},
}, {
	city: {id: 1, name: 'Dnipro'},
	clock: {id: 2, size: 'Medium', price: 2},
	endWorkOn: '2022-04-05T18:00:00.000Z',
	id: '6d64b7d6-9218-4705-bbbb-fcd654b6df05',
	images: 'http://res.cloudinary.com/dplgyedon/image/upload/v1648708090/boqobo0l0yjmensounsg.jpg',
	isCompleted: true,
	master: {id: '74b59821-f716-4c73-aa30-e8ed3bd16021', name: 'Master Alex'},
	orderAddress: 'Oleksandra Polia Ave, 2, Dnipropetrovs\'k, Dnipropetrovs\'ka oblast, Ukraine, 49000',
	paymentDate: '2022-03-31T06:29:18.542Z',
	ratingIdentificator: 'e3065a55-07cd-45a4-a2d0-48a1331435a6',
	startWorkOn: '2022-04-05T16:00:00.000Z',
	user: {id: '42efed91-7164-4d15-bf07-0f090f07208d', name: 'Alexey Kiz', email: 'CloudinaryTest2@gmail.com'},
}, {
	city: {id: 2, name: 'Uzgorod'},
	clock: {id: 2, size: 'Medium', price: 2},
	endWorkOn: '2022-03-07T12:00:00.000Z',
	id: '6e72188b-ceb0-459b-a34d-95b393e6bbfb',
	images: 'http://res.cloudinary.com/dplgyedon/image/upload/v1646586016/vzbbsxk9bb99tjst0mqc.png',
	isCompleted: false,
	master: {id: '52cb872f-579b-419c-b092-997a4473d59f', name: 'Rahmed'},
	orderAddress: null,
	paymentDate: '2022-03-06T17:00:54.625Z',
	ratingIdentificator: '2239beae-b021-4439-8b83-13c92e172fe4',
	startWorkOn: '2022-03-07T10:00:00.000Z',
	user: {id: '5b512492-ece8-48f4-9b8e-ce34dff6f87b', name: 'Stepan', email: 'admin@test.com'},
}];

const cities = [
	{id: 1, name: 'Dnipro'},
	{id: 2, name: 'Uzgorod'},
	{id: 3, name: 'Odessa'},
];

const masters = [{
	cities: [
		{id: 2, name: 'Uzgorod'},
		{id: 1, name: 'Dnipro'},
	],
	id: '8f12fab3-5dd6-4a0b-adb2-284766f7a2ce',
	name: 'Super Master',
	rating: 0,
}, {
	cities: [{id: 2, name: 'Uzgorod'}],
	id: '85a1abd5-aa95-4cc7-bdaf-bfdca9e2a67d',
	name: 'Time God',
	rating: 0,
}, {
	cities: [{id: 1, name: 'Dnipro'}],
	id: 'dce55acd-b552-458b-85b5-785e821b336c',
	name: 'Valera',
	rating: 0,
}, {
	cities: [{id: 2, name: 'Uzgorod'}],
	id: '52cb872f-579b-419c-b092-997a4473d59f',
	name: 'Rahmed',
	rating: 0,
}, {
	cities: [
		{id: 1, name: 'Dnipro'},
		{id: 2, name: 'Uzgorod'},
		{id: 3, name: 'Odessa'},
	],
	id: '234eaf37-740a-47c7-80fe-3a5051dc356b',
	name: 'Master Rybachuk',
	rating: 5,
}];

const clocks = [
	{id: 1, size: 'Small', price: 1, installationTime: 1},
	{id: 2, size: 'Medium', price: 2, installationTime: 2},
	{id: 3, size: 'Large', price: 3, installationTime: 3},
];

describe('Orders List', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		window.confirm = jest.fn(() => true);
		mockAxios.onGet(URL.MASTER).reply(200, masters);
		mockAxios.onGet(URL.CLOCK).reply(200, clocks);
		mockAxios.onGet(URL.CITY).reply(200, cities);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		mockAxios.onGet(URL.ORDER).reply(200, {count: 5, rows: ordersForTable});
		const {asFragment} = renderWithReduxAndRouter({
			component: <OrdersList />,
			path: '/admin/orders-list',
			store,
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component with data, shows modals, delete order', async () => {
		mockAxios.onGet(URL.ORDER).reply(200, {count: 5, rows: ordersForTable});
		mockAxios.onDelete(URL.ORDER).reply(204);

		const {getAllByTestId, findAllByTestId, getByTestId, findByTestId} = renderWithReduxAndRouter({
			component: <OrdersList />,
			path: '/admin/orders-list',
			store,
		});

		await waitFor(() => {
			expect(getAllByTestId('orders-list-row').length).toBe(5);
		});

		const openImgModal = await findAllByTestId('order-modal-images-button');
		fireEvent.click(openImgModal[0]);

		await waitFor(() => {
			expect(getByTestId('order-modal-images')).toBeInTheDocument();
		});

		const closeImgModal = await findByTestId('HighlightOffIcon');
		fireEvent.click(closeImgModal);

		const openInfoModal = await findAllByTestId('order-modal-info-button');
		fireEvent.click(openInfoModal[0]);

		await waitFor(() => {
			expect(getByTestId('order-modal-info')).toBeInTheDocument();
		});

		const closeInfoModal = await findByTestId('HighlightOffIcon');
		fireEvent.click(closeInfoModal);

		const deleteButtons = await findAllByTestId('delete-list-button');
		fireEvent.click(deleteButtons[0]);

		await waitFor(() => {
			expect(mockAxios.history.delete.length).toBe(1);
			expect(mockAxios.history.delete[0].data).toBe(JSON.stringify({
				id: '2538907c-1d7a-4cac-87ff-b5bf8dd66d5a',
			}));
		});
	});

	it('should render component with filters list, triggers filters field handlers', async () => {
		mockAxios.onGet(URL.ORDER).reply(200, {count: 5, rows: ordersForTable});

		const {getByTestId} = renderWithReduxAndRouter({
			component: <OrdersList />,
			path: '/admin/orders-list',
			store,
		});

		fireEvent.click(getByTestId('order-list-filter-button'));

		await waitFor(() => {
			expect(getByTestId('filters-list')).toBeInTheDocument();
		});

		fireEvent.change(getByTestId('master-filter'), {
			target: {value: 'Super Master'},
		});

		fireEvent.change(getByTestId('city-filter'), {
			target: {value: 'Dnipro'},
		});

		fireEvent.change(getByTestId('clock-filter'), {
			target: {value: 'Small'},
		});

		fireEvent.click(getByTestId('isCompleted-filter'));

		fireEvent.change(getByTestId('start-date-filter'), {
			target: {value: '2024-03-23T09:00:00.000Z'},
		});

		fireEvent.change(getByTestId('end-date-filter'), {
			target: {value: '2024-03-24T09:00:00.000Z'},
		});

		await waitFor(() => {
			expect((getByTestId('master-filter') as HTMLInputElement).value).toBe('Super Master');
			expect((getByTestId('city-filter') as HTMLInputElement).value).toBe('Dnipro');
			expect((getByTestId('clock-filter') as HTMLInputElement).value).toBe('Small');
			expect((getByTestId('isCompleted-filter') as HTMLInputElement).checked).toBe(true);
			expect((getByTestId('start-date-filter') as HTMLInputElement).value).toBe('2024-03-23T09:00:00.000Z');
			expect((getByTestId('end-date-filter') as HTMLInputElement).value).toBe('2024-03-24T09:00:00.000Z');
		});
	});
});
