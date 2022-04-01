import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Statistics from './Statistics';
import {fireEvent, cleanup, waitFor, findByAltText, findByText} from '@testing-library/react';
import {URL} from '../../../data/constants/routeConstants';
import {renderWithRouter} from '../../../data/constants/test-utilities';

const cities = [{
	id: 1, name: 'Dnipro',
}, {
	id: 2, name: 'Uzgorod',
}, {
	id: 3, name: 'Odessa',
}];

const masters = [{
	cities: [{
		id: 2, name: 'Uzgorod',
	}, {
		id: 1, name: 'Dnipro',
	}],
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
	cities: [{
		id: 1, name: 'Dnipro',
	}, {
		id: 2, name: 'Uzgorod',
	}, {
		id: 3, name: 'Odessa',
	}],
	id: '234eaf37-740a-47c7-80fe-3a5051dc356b',
	name: 'Master Rybachuk',
	rating: 5,
}, {
	cities: [{
		id: 2, name: 'Uzgorod',
	}, {
		id: 3, name: 'Odessa',
	}, {
		id: 1, name: 'Dnipro',
	}],
	id: '74b59821-f716-4c73-aa30-e8ed3bd16021',
	name: 'Master Alex',
	rating: 0,
}];

const totalOrdersChart = [
	{orders: 1, date: '2022-03-05'},
	{orders: 4, date: '2022-03-07'},
	{orders: 1, date: '2022-03-08'},
	{orders: 1, date: '2022-03-18'},
	{orders: 1, date: '2022-03-31'},
	{orders: 1, date: '2022-04-01'},
	{orders: 1, date: '2022-04-05'},
	{orders: 1, date: '2022-04-07'},
	{orders: 1, date: '2022-04-08'},
];

const ordersForCitiesPieChart = [
	{orders: '1', city: 'Odessa'},
	{orders: '5', city: 'Uzgorod'},
	{orders: '6', city: 'Dnipro'},
];

const ordersForMastersPieChart = [
	{orders: '7', master: 'Master Rybachuk'},
	{orders: '2', master: 'Rahmed'},
	{orders: '2', master: 'Valera'},
	{orders: '1', master: 'Others'},
];

const masterStatisticsData = [{
	completed: 1,
	earnedAmount: 2,
	id: '74b59821-f716-4c73-aa30-e8ed3bd16021',
	largeClocks: 0,
	mediumClocks: 1,
	name: 'Master Alex',
	rating: 0,
	smallClocks: 0,
	uncompleted: 0,
}, {
	completed: 4,
	earnedAmount: 7,
	id: '234eaf37-740a-47c7-80fe-3a5051dc356b',
	largeClocks: 1,
	mediumClocks: 4,
	name: 'Master Rybachuk',
	rating: 5,
	smallClocks: 2,
	uncompleted: 3,
}, {
	completed: 0,
	earnedAmount: 0,
	id: '52cb872f-579b-419c-b092-997a4473d59f',
	largeClocks: 0,
	mediumClocks: 2,
	name: 'Rahmed',
	rating: 0,
	smallClocks: 0,
	uncompleted: 2,
}, {
	completed: 0,
	earnedAmount: 0,
	id: '8f12fab3-5dd6-4a0b-adb2-284766f7a2ce',
	largeClocks: 0,
	mediumClocks: 0,
	name: 'Super Master',
	rating: 0,
	smallClocks: 0,
	uncompleted: 0,
}, {
	completed: 0,
	earnedAmount: 0,
	id: '85a1abd5-aa95-4cc7-bdaf-bfdca9e2a67d',
	largeClocks: 0,
	mediumClocks: 0,
	name: 'Time God',
	rating: 0,
	smallClocks: 0,
	uncompleted: 0,
}];

describe('Statistics', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		mockAxios.onGet(URL.CITY).reply(200, cities);
		mockAxios.onGet(URL.MASTER).reply(200, masters);
		mockAxios.onGet(URL.TOTAL_ORDERS_CHART).reply(200, totalOrdersChart);
		mockAxios.onGet(URL.TOTAL_ORDERS_CITIES_PIE_CHART).reply(200, ordersForCitiesPieChart);
		mockAxios.onGet(URL.TOTAL_ORDERS_MASTERS_PIE_CHART).reply(200, ordersForMastersPieChart);
		mockAxios.onGet(URL.MASTERS_STATISTICS_TABLE).reply(200, {count: 5, row: masterStatisticsData});
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		const {asFragment} = renderWithRouter({
			component: <Statistics />,
			path: '/admin/statistics',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component with data, triggers data field on total order chart', async () => {
		const {getByTestId} = renderWithRouter({
			component: <Statistics />,
			path: '/admin/statistics',
		});

		fireEvent.change(getByTestId('total-chart-start-date-input'), {
			target: {value: '2024-03-23T09:00:00.000Z'},
		});

		fireEvent.change(getByTestId('total-chart-end-date-input'), {
			target: {value: '2024-03-24T09:00:00.000Z'},
		});

		await waitFor(() => {
			expect((getByTestId('total-chart-start-date-input') as HTMLInputElement).value).toBe('2024-03-23T09:00:00.000Z');
			expect((getByTestId('total-chart-end-date-input') as HTMLInputElement).value).toBe('2024-03-24T09:00:00.000Z');
		});
	});

	it('should render component with data, triggers cities select on total order chart', async () => {
		const {getByTestId, getByLabelText, findByText} = renderWithRouter({
			component: <Statistics />,
			path: '/admin/statistics',
		});

		fireEvent.mouseDown(getByLabelText('Cities'));
		const choosenCityOption = await findByText('Dnipro');
		fireEvent.click(choosenCityOption);

		await waitFor(() => {
			expect((getByTestId('total-chart-cities-select') as HTMLInputElement).value).toBe('1');
		});
	});

	it('should render component with data, triggers masters select on total order chart', async () => {
		const {getByTestId, getByLabelText, findByText} = renderWithRouter({
			component: <Statistics />,
			path: '/admin/statistics',
		});

		fireEvent.mouseDown(getByLabelText('Masters'));
		const choosenMasterOption = await findByText('Super Master');
		fireEvent.click(choosenMasterOption);

		await waitFor(() => {
			expect((getByTestId('total-chart-masters-select') as HTMLInputElement).value).toBe('8f12fab3-5dd6-4a0b-adb2-284766f7a2ce');
		});
	});

	it('should render component with data, triggers data field on cities pie chart', async () => {
		const {getByTestId} = renderWithRouter({
			component: <Statistics />,
			path: '/admin/statistics',
		});

		fireEvent.change(getByTestId('cities-chart-start-date-input'), {
			target: {value: '2024-03-23T09:00:00.000Z'},
		});

		fireEvent.change(getByTestId('cities-chart-end-date-input'), {
			target: {value: '2024-03-24T09:00:00.000Z'},
		});

		await waitFor(() => {
			expect((getByTestId('cities-chart-start-date-input') as HTMLInputElement).value).toBe('2024-03-23T09:00:00.000Z');
			expect((getByTestId('cities-chart-end-date-input') as HTMLInputElement).value).toBe('2024-03-24T09:00:00.000Z');
		});
	});

	it('should render component with data, triggers data field on masters pie chart', async () => {
		const {getByTestId} = renderWithRouter({
			component: <Statistics />,
			path: '/admin/statistics',
		});

		fireEvent.change(getByTestId('masters-chart-start-date-input'), {
			target: {value: '2024-03-23T09:00:00.000Z'},
		});

		fireEvent.change(getByTestId('masters-chart-end-date-input'), {
			target: {value: '2024-03-24T09:00:00.000Z'},
		});

		await waitFor(() => {
			expect((getByTestId('masters-chart-start-date-input') as HTMLInputElement).value).toBe('2024-03-23T09:00:00.000Z');
			expect((getByTestId('masters-chart-end-date-input') as HTMLInputElement).value).toBe('2024-03-24T09:00:00.000Z');
		});
	});

	it('should render component with fulfilled statistics table', async () => {
		const {getAllByTestId} = renderWithRouter({
			component: <Statistics />,
			path: '/admin/statistics',
		});

		await waitFor(() => {
			expect(getAllByTestId('statistics-table-row').length).toBe(5);
		});
	});
});
