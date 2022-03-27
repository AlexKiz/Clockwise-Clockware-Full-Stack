import React from 'react';
import CityCreate from './CityCreate';
import {fireEvent, act, cleanup} from '@testing-library/react';
import {renderWithRouter} from '../../../../data/constants/test-utilities';


it('matches snapshot', () => {
	const {asFragment} = renderWithRouter({
		component: <CityCreate />,
		path: '/admin/city-create',
	});
	expect(asFragment()).toMatchSnapshot();
});

describe('City Create', () => {
	afterEach(() => {
		cleanup();
	});
	const mockSubmit = jest.fn();
	const cityCreateValues = {
		name: '',
	};
	jest.mock('react-router-dom', () => ({
		useHistory: () => ({
			push: jest.fn(),
		}),
	}));

	it('shows input with empty value', () => {
		const {getByTestId} = renderWithRouter({
			component: <CityCreate />,
			path: '/admin/city-create',
		});
		expect((getByTestId('city-name-input') as HTMLInputElement).value).toBe('');
	});

	it('shows render component with initial value', () => {
		const {getByTestId} = renderWithRouter({
			component: <CityCreate />,
			path: '/admin/city-create/Dnipro',
		});
		expect((getByTestId('city-name-input') as HTMLInputElement).value).toBe('Dnipro');
	});
});
