import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Calendar from './Calendar';
import {cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../data/constants/routeConstants';
import {renderWithRouter} from '../../../data/constants/test-utilities';

const ordersForCalendar = [{
	clientEmail: 'CloudinaryTest2@gmail.com',
	clientName: 'Alexey Kiz',
	clockSize: 'Medium',
	color: 'green',
	end: '2022-04-05T18:00:00.000Z',
	id: '6d64b7d6-9218-4705-bbbb-fcd654b6df05',
	isCompleted: true,
	price: '20 $',
	ratingIdentificator: 'e3065a55-07cd-45a4-a2d0-48a1331435a6',
	start: '2022-04-05T16:00:00.000Z',
	title: 'Repair clock with Medium size. Client: Alexey Kiz',
}];

describe('Calendar', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		mockAxios.onGet(URL.ORDERS_FOR_CALENDAR).reply(200, ordersForCalendar);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		const {asFragment} = renderWithRouter({
			component: <Calendar />,
			path: '/master/calendar',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component', async () => {
		const {getByTestId} = renderWithRouter({
			component: <Calendar />,
			path: '/master/calendar',
		});

		await waitFor(() => {
			expect(getByTestId('master-calendar-component')).toBeInTheDocument();
		});
	});
});

