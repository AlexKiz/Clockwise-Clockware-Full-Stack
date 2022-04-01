import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ClientOrdersList from './ClientOrdersList';
import {cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithRouter} from '../../../../data/constants/test-utilities';

const ordersForTable = [{
	clock: {
		id: 1,
		size: 'Small',
		price: 1,
	},
	endWorkOn: '2022-04-08T18:00:00.000Z',
	id: 'bea199ff-69fc-49c0-b896-6546ad4d9a60',
	isCompleted: false,
	master: {
		id: 'dce55acd-b552-458b-85b5-785e821b336c',
		name: 'Valera',
	},
	orderAddress: '',
	orderRating: 0,
	ratingIdentificator: '24f52dd1-2ebd-4565-933b-4dbc15afccaa',
	startWorkOn: '2022-04-08T17:00:00.000Z',
}, {
	clock: {
		id: 1,
		size: 'Small',
		price: 1,
	},
	endWorkOn: '2022-04-08T18:00:00.000Z',
	id: '809e3587-a5bd-45af-b4a5-bfb1bc0f4160',
	isCompleted: false,
	master: {
		id: '189a5b5e-ea13-427b-8f93-45dbc18bde5e',
		name: 'Valera',
	},
	orderAddress: '',
	orderRating: 0,
	ratingIdentificator: '68a965cf-8b3e-457d-b5aa-6bd24d4eda19',
	startWorkOn: '2022-04-08T17:00:00.000Z',
}, {
	clock: {
		id: 1,
		size: 'Small',
		price: 1,
	},
	endWorkOn: '2022-04-08T18:00:00.000Z',
	id: '6c9f01a6-a6a7-4a56-8d24-2d50ba9f1c45',
	isCompleted: false,
	master: {
		id: '360e014f-8069-4586-be7a-ef5db266808f',
		name: 'Valera',
	},
	orderAddress: '',
	orderRating: 0,
	ratingIdentificator: '9ab8653f-eaca-4443-8a06-08a27b0e729f',
	startWorkOn: '2022-04-08T17:00:00.000Z',
}];

describe('Client Orders List', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		mockAxios.onGet(URL.ORDER).reply(200, ordersForTable);
		const {asFragment} = renderWithRouter({
			component: <ClientOrdersList />,
			path: 'client/orders-list',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component with empty list', async () => {
		mockAxios.onGet(URL.ORDER).reply(200, []);
		const {getByTestId} = renderWithRouter({
			component: <ClientOrdersList />,
			path: 'client/orders-list',
		});

		await waitFor(() => {
			expect(getByTestId('no-orders-label')).toBeInTheDocument();
		});
	});

	it('should render component with data', async () => {
		mockAxios.onGet(URL.ORDER).reply(200, ordersForTable);

		const {getAllByTestId} = renderWithRouter({
			component: <ClientOrdersList />,
			path: 'client/orders-list',
		});

		await waitFor(() => {
			expect(getAllByTestId('orders-list-row').length).toBe(3);
		});
	});
});

