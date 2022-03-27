import React from 'react';
import LoginForm from './LoginForm';
import {act, cleanup, fireEvent} from '@testing-library/react';
import {renderWithRouter, rerenderWrapper} from '../../../data/constants/test-utilities';

describe('Login Form Component', () => {
	beforeEach(() => {
		cleanup();
	});
	jest.mock('react-router-dom', () => ({
		...jest.requireActual('react-router-dom'),
		useHistory: () => ({
			push: jest.fn(),
		}),
		useLocation: () => ({
			pathname: '/login',
		}),
	}));

	it('matches snapshot', () => {
		const {asFragment} = renderWithRouter({
			component: <LoginForm />,
			path: '/login',
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it('shows inputs with empty values', () => {
		const {getByTestId} = renderWithRouter({
			component: <LoginForm />,
			path: '/login',
		});

		expect((getByTestId('login-email-input') as HTMLInputElement).value).toBe('');
		expect((getByTestId('login-password-input') as HTMLInputElement).value).toBe('');
	});

	it('triggers event handlers on inputs', () => {
		const {getByTestId, rerender} = renderWithRouter({
			component: <LoginForm />,
			path: '/login',
		});

		act(() => {
			fireEvent.change(getByTestId('login-email-input'), {
				target: {value: 'testLogin@gmail.com'},
			});
			fireEvent.change(getByTestId('login-password-input'), {
				target: {value: 'TestPassword1!'},
			});

			rerender(rerenderWrapper({
				component: <LoginForm />,
				path: '/login',
			}));
		});

		expect((getByTestId('login-email-input') as HTMLInputElement).value).toBe('testLogin@gmail.com');
		expect((getByTestId('login-password-input') as HTMLInputElement).value).toBe('TestPassword1!');
	});
});
