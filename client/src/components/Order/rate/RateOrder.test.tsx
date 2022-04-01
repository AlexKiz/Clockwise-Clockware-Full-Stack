import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import RateOrder from './RateOrder';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../data/constants/routeConstants';
import {renderWithRouterAndParams} from '../../../data/constants/test-utilities';

const orderForRate = {
	city: {
		id: 1,
		name: 'Dnipro',
	},
	clock: {
		id: 2,
		size: 'Medium',
	},
	endWorkOn: '2022-04-05T18:00:00.000Z',
	id: '6d64b7d6-9218-4705-bbbb-fcd654b6df05',
	master: {
		id: '74b59821-f716-4c73-aa30-e8ed3bd16021',
		name: 'Master Alex',
	},
	startWorkOn: '2022-04-05T16:00:00.000Z',
	user: {
		id: '42efed91-7164-4d15-bf07-0f090f07208d',
		name: 'Alexey Kiz',
		email: 'EmailTest2@gmail.com',
	}};

describe('Rate Order', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		mockAxios.onGet(URL.ORDER_FOR_RATE).reply(200, orderForRate);
		mockAxios.onPut(URL.RATED_ORDER).reply(200);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		const {asFragment} = renderWithRouterAndParams({
			component: <RateOrder />,
			pathWithParamValue: '/rate/e3065a55-07cd-45a4-a2d0-48a1331435a6',
			pathWithParamName: '/rate/:ratingIdentificatorParam',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should rate order', async () => {
		const {getByTestId, getAllByText} = renderWithRouterAndParams({
			component: <RateOrder />,
			pathWithParamValue: '/rate/e3065a55-07cd-45a4-a2d0-48a1331435a6',
			pathWithParamName: '/rate/:ratingIdentificatorParam',
		});

		const stars = getAllByText(/★/i);
		fireEvent.click(stars[4]);

		fireEvent.click(getByTestId('order-rate-submit'));

		await waitFor(() => {
			expect(mockAxios.history.put.length).toBe(1);
			expect(mockAxios.history.put[0].data).toBe(JSON.stringify({
				id: '6d64b7d6-9218-4705-bbbb-fcd654b6df05',
				orderRated: 4.5,
				masterId: '74b59821-f716-4c73-aa30-e8ed3bd16021',
			}));
		});
	});
});

