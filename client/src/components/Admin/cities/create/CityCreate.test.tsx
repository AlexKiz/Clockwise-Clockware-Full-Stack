import React from 'react';
import CityCreate from './CityCreate';
import {MemoryRouter} from 'react-router-dom';

import {render, fireEvent, act} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<CityCreate />, {wrapper: MemoryRouter});

	expect(asFragment()).toMatchSnapshot();
});

describe('City Create', () => {
	const mockSubmit = jest.fn();
	const cityCreateValues = {
		name: '',
	};

	it('shows input with empty value', () => {
		const {getByTestId} = render(<CityCreate />, {wrapper: MemoryRouter});

		const cityNameInput = getByTestId('city-name-input');

		expect(cityNameInput.value).toBe('');
	});
});
