import React from 'react';
import Registration from './Registration';
import {act, cleanup, fireEvent} from '@testing-library/react';
import {renderWithRouter, rerenderWrapper} from '../../../../data/constants/test-utilities';

describe('Registration Form Component', () => {
	beforeEach(() => {
		cleanup();
	});
	jest.mock('react-router-dom', () => ({
		...jest.requireActual('react-router-dom'),
		useHistory: () => ({
			push: jest.fn(),
		}),
		useLocation: () => ({
			pathname: '/registration-form',
		}),
	}));

	it('matches snapshot', () => {
		const {asFragment} = renderWithRouter({
			component: <Registration />,
			path: '/registration-form',
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it('shows inputs with empty values', () => {
		const {getByTestId} = renderWithRouter({
			component: <Registration />,
			path: '/registration-form',
		});

		expect((getByTestId('registration-email-input') as HTMLInputElement).value).toBe('');
		expect((getByTestId('registration-password-input') as HTMLInputElement).value).toBe('');
		expect((getByTestId('registration-repeatPassword-input') as HTMLInputElement).value).toBe('');
		expect((getByTestId('registration-firstName-input') as HTMLInputElement).value).toBe('');
		expect((getByTestId('registration-lastName-input') as HTMLInputElement).value).toBe('');
		expect((getByTestId('registration-license-checkbox') as HTMLInputElement).checked).toEqual(false);
		expect((getByTestId('registration-isMaster-checkbox') as HTMLInputElement).checked).toEqual(false);
	});

	it('triggers event handlers on UI elements', () => {
		const {getByTestId, rerender} = renderWithRouter({
			component: <Registration />,
			path: '/registration-form',
		});

		act(() => {
			fireEvent.change(getByTestId('registration-email-input'), {
				target: {value: 'testRegistration@gmail.com'},
			});
			fireEvent.change(getByTestId('registration-password-input'), {
				target: {value: 'TestPassword1!'},
			});
			fireEvent.change(getByTestId('registration-repeatPassword-input'), {
				target: {value: 'TestPassword1!'},
			});
			fireEvent.change(getByTestId('registration-firstName-input'), {
				target: {value: 'First'},
			});
			fireEvent.change(getByTestId('registration-lastName-input'), {
				target: {value: 'Last'},
			});
			fireEvent.click(getByTestId('registration-license-checkbox'));
			fireEvent.click(getByTestId('registration-isMaster-checkbox'));
		});

		rerender(rerenderWrapper({
			component: <Registration />,
			path: '/registration-form',
		}));

		expect((getByTestId('registration-email-input') as HTMLInputElement).value).toBe('testRegistration@gmail.com');
		expect((getByTestId('registration-password-input') as HTMLInputElement).value).toBe('TestPassword1!');
		expect((getByTestId('registration-repeatPassword-input') as HTMLInputElement).value).toBe('TestPassword1!');
		expect((getByTestId('registration-firstName-input') as HTMLInputElement).value).toBe('First');
		expect((getByTestId('registration-lastName-input') as HTMLInputElement).value).toBe('Last');
		expect((getByTestId('registration-license-checkbox') as HTMLInputElement).checked).toEqual(true);
		expect((getByTestId('registration-isMaster-checkbox') as HTMLInputElement).checked).toEqual(true);
		expect((getByTestId('registration-cities-select') as HTMLInputElement)).toBeInTheDocument();
	});
});
