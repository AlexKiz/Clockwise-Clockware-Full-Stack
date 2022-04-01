import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MasterOrdersList from './MasterOrdersList';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithRouter} from '../../../../data/constants/test-utilities';

const ordersForTable = [{
	city: {
		id: 1,
		name: 'Dnipro',
	},
	clock: {
		id: 2,
		size: 'Medium',
		price: 2,
	},
	endWorkOn: '2022-04-05T18:00:00.000Z',
	id: '6d64b7d6-9218-4705-bbbb-fcd654b6df05',
	images: 'http://res.cloudinary.com/dplgyedon/image/upload/v1648708090/boqobo0l0yjmensounsg.jpg',
	isCompleted: false,
	master: {
		id: '74b59821-f716-4c73-aa30-e8ed3bd16021',
		name: 'Master Alex',
	},
	orderAddress: 'Oleksandra Polia Ave, 2, Dnipropetrovs\'k, Dnipropetrovs\'ka oblast, Ukraine, 49000',
	paymentDate: '2022-03-31T06:29:18.542Z',
	ratingIdentificator: 'e3065a55-07cd-45a4-a2d0-48a1331435a6',
	startWorkOn: '2022-04-05T16:00:00.000Z',
	user: {
		id: '42efed91-7164-4d15-bf07-0f090f07208d',
		name: 'Alexey Kiz',
		email: 'CloudinaryTest2@gmail.com',
	},
}, {
	city: {
		id: 2,
		name: 'Odessa',
	},
	clock: {
		id: 3,
		size: 'Large',
		price: 3,
	},
	endWorkOn: '2022-04-05T18:00:00.000Z',
	id: 'e05b1a7c-36ef-42eb-a959-c57494736da7',
	images: '',
	isCompleted: false,
	master: {
		id: '74b59821-f716-4c73-aa30-e8ed3bd16021',
		name: 'Master Alex',
	},
	orderAddress: null,
	paymentDate: '2022-03-31T06:29:18.542Z',
	ratingIdentificator: 'e3065a55-07cd-45a4-a2d0-48a1331435a6',
	startWorkOn: '2022-04-05T16:00:00.000Z',
	user: {
		id: '42efed91-7164-4d15-bf07-0f090f07208d',
		name: 'Alexey Kiz',
		email: 'CloudinaryTest2@gmail.com',
	},
}, {
	city: {
		id: 2,
		name: 'Odessa',
	},
	clock: {
		id: 2,
		size: 'Medium',
		price: 2,
	},
	endWorkOn: '2022-04-05T18:00:00.000Z',
	id: '5dadb130-4d6e-406a-9544-86032c1af2df',
	images: '',
	isCompleted: false,
	master: {
		id: '74b59821-f716-4c73-aa30-e8ed3bd16021',
		name: 'Master Alex',
	},
	orderAddress: 'Oleksandra Polia Ave, 2, Dnipropetrovs\'k, Dnipropetrovs\'ka oblast, Ukraine, 49000',
	paymentDate: '2022-03-31T06:29:18.542Z',
	ratingIdentificator: 'e3065a55-07cd-45a4-a2d0-48a1331435a6',
	startWorkOn: '2022-04-05T16:00:00.000Z',
	user: {
		id: '42efed91-7164-4d15-bf07-0f090f07208d',
		name: 'Alexey Kiz',
		email: 'CloudinaryTest2@gmail.com',
	},
}, {
	city: {
		id: 2,
		name: 'Odessa',
	},
	clock: {
		id: 2,
		size: 'Medium',
		price: 2,
	},
	endWorkOn: '2022-04-05T18:00:00.000Z',
	id: 'd5be92f5-7a35-45ad-986e-9c3b96021f44',
	images: '',
	isCompleted: false,
	master: {
		id: '74b59821-f716-4c73-aa30-e8ed3bd16021',
		name: 'Master Alex',
	},
	orderAddress: 'Oleksandra Polia Ave, 2, Dnipropetrovs\'k, Dnipropetrovs\'ka oblast, Ukraine, 49000',
	paymentDate: '2022-03-31T06:29:18.542Z',
	ratingIdentificator: 'e3065a55-07cd-45a4-a2d0-48a1331435a6',
	startWorkOn: '2022-04-05T16:00:00.000Z',
	user: {
		id: '42efed91-7164-4d15-bf07-0f090f07208d',
		name: 'Alexey Kiz',
		email: 'CloudinaryTest2@gmail.com',
	},
}, {
	city: {
		id: 2,
		name: 'Odessa',
	},
	clock: {
		id: 2,
		size: 'Medium',
		price: 2,
	},
	endWorkOn: '2022-04-05T18:00:00.000Z',
	id: '84cc5c1f-c923-4674-a020-8b708f26a049',
	images: '',
	isCompleted: false,
	master: {
		id: '74b59821-f716-4c73-aa30-e8ed3bd16021',
		name: 'Master Alex',
	},
	orderAddress: 'Oleksandra Polia Ave, 2, Dnipropetrovs\'k, Dnipropetrovs\'ka oblast, Ukraine, 49000',
	paymentDate: '2022-03-31T06:29:18.542Z',
	ratingIdentificator: 'e3065a55-07cd-45a4-a2d0-48a1331435a6',
	startWorkOn: '2022-04-05T16:00:00.000Z',
	user: {
		id: '42efed91-7164-4d15-bf07-0f090f07208d',
		name: 'Alexey Kiz',
		email: 'CloudinaryTest2@gmail.com',
	},
}];

describe('Master Orders List', () => {
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
		mockAxios.onGet(URL.ORDER).reply(200, ordersForTable);

		const {asFragment} = renderWithRouter({
			component: <MasterOrdersList />,
			path: '/master/orders-list',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component with empty list', async () => {
		mockAxios.onGet(URL.ORDER).reply(200, []);

		const {getByTestId} = renderWithRouter({
			component: <MasterOrdersList />,
			path: '/master/orders-list',
		});

		await waitFor(() => {
			expect(getByTestId('no-orders-label')).toBeInTheDocument();
		});
	});

	it('should render component with data, shows modals, complete order', async () => {
		mockAxios.onGet(URL.ORDER).reply(200, ordersForTable);
		mockAxios.onPut(URL.COMPLETE_ORDER).reply(200);

		const {getAllByTestId, findAllByTestId, getByTestId, findByTestId} = renderWithRouter({
			component: <MasterOrdersList />,
			path: '/master/orders-list',
		});

		await waitFor(() => {
			expect(getAllByTestId('master-orders-list-row').length).toBe(5);
		});

		const openImgModal = await findAllByTestId('master-order-modal-images-button');
		fireEvent.click(openImgModal[0]);

		await waitFor(() => {
			expect(getByTestId('master-order-modal-images')).toBeInTheDocument();
		});

		const closeImgModal = await findByTestId('HighlightOffIcon');
		fireEvent.click(closeImgModal);

		const openInfoModal = await findAllByTestId('master-order-modal-info-button');
		fireEvent.click(openInfoModal[0]);

		await waitFor(() => {
			expect(getByTestId('master-order-modal-info')).toBeInTheDocument();
		});

		const closeInfoModal = await findByTestId('HighlightOffIcon');
		fireEvent.click(closeInfoModal);

		const completeOrderButton = await findAllByTestId('master-order-complete-button');
		fireEvent.click(completeOrderButton[0]);

		await waitFor(() => {
			expect(mockAxios.history.put.length).toBe(1);
			expect(mockAxios.history.put[0].data).toBe(JSON.stringify({
				id: '6d64b7d6-9218-4705-bbbb-fcd654b6df05',
				clientEmail: 'CloudinaryTest2@gmail.com',
				ratingIdentificator: 'e3065a55-07cd-45a4-a2d0-48a1331435a6',
				clockSize: 'Medium',
				masterName: 'Master Alex',
				masterId: '74b59821-f716-4c73-aa30-e8ed3bd16021',
				startWorkOn: '2022-04-05T16:00:00.000Z',
				endWorkOn: '2022-04-05T18:00:00.000Z',
				price: 2,
				clientName: 'Alexey Kiz',
			}));
		});
	});
});

