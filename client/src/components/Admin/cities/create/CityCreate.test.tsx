import React from 'react';
import CityCreate from './CityCreate';
import {customRender} from 'src/data/constants/test-utilities';
import {fireEvent, act} from '@testing-library/react';
import {Route} from 'react-router-dom';

it('matches snapshot', () => {
	const {asFragment} = customRender(
		<Route path='/admin/city-create'>
			<CityCreate />
		</Route>);

	expect(asFragment()).toMatchSnapshot();
});

describe('City Create', () => {
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
		const {getByTestId} = customRender(
			<Route path='/admin/city-create'>
				<CityCreate />
			</Route>);

		expect((getByTestId('city-name-input') as HTMLInputElement).value).toBe('');
	});
});
