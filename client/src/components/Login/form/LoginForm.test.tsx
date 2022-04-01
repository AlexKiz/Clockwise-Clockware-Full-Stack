/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import LoginForm from './LoginForm';
import {cleanup, fireEvent, waitFor} from '@testing-library/react';
import {URL} from '../../../data/constants/routeConstants';
import {renderWithRouter} from '../../../data/constants/test-utilities';

describe('Login Form', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			...jest.requireActual('react-router-dom'),
			useLocation: () => ({
				pathname: '/login',
			}),
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		jest.mock('react-i18next', () => ({
			useTranslation: () => {
				return {
					t: (str) => str,
					i18n: {
						changeLanguage: () => new Promise(() => {}),
					},
				};
			},
		}));
		mockAxios.onPost(URL.LOGIN).reply(200);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});


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

	it('triggers event handlers on UI elements, post order on submit', async () => {
		const {getByTestId} = renderWithRouter({
			component: <LoginForm />,
			path: '/login',
		});

		fireEvent.change(getByTestId('login-email-input'), {
			target: {value: 'testLogin@gmail.com'},
		});
		fireEvent.change(getByTestId('login-password-input'), {
			target: {value: 'TestPassword1!'},
		});
		fireEvent.click(getByTestId('login-submit-button'));

		await waitFor(() => {
			expect((getByTestId('login-email-input') as HTMLInputElement).value).toBe('testLogin@gmail.com');
			expect((getByTestId('login-password-input') as HTMLInputElement).value).toBe('TestPassword1!');
			expect(mockAxios.history.post.length).toBe(1);
			expect(mockAxios.history.post[0].data).toBe(JSON.stringify({
				login: 'testLogin@gmail.com',
				password: 'TestPassword1!',
			}));
		});
	});
});
