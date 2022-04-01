/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Registration from './Registration';
import {cleanup, fireEvent, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithRouter} from '../../../../data/constants/test-utilities';

const cityForMasterRegistration = [{
	id: 1,
	name: 'Dnipro',
}, {
	id: 2,
	name: 'Uzgorod',
}, {
	id: 3,
	name: 'Odessa',
}];

describe('Registration', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			...jest.requireActual('react-router-dom'),
			useHistory: () => ({
				push: jest.fn(),
			}),
			useLocation: () => ({
				pathname: '/registration-form',
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
		mockAxios.onGet(URL.CITY).reply(200, cityForMasterRegistration);
		mockAxios.onPost(URL.REGISTRATION).reply(201);
	});

	afterEach(() => {
		cleanup();
	});


	it('matches snapshot', async () => {
		const {asFragment} = renderWithRouter({
			component: <Registration />,
			path: '/registration-form',
		});
		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component with empty values', async () => {
		const {getByTestId} = renderWithRouter({
			component: <Registration />,
			path: '/registration-form',
		});

		await waitFor(() => {
			expect((getByTestId('registration-email-input') as HTMLInputElement).value).toBe('');
			expect((getByTestId('registration-password-input') as HTMLInputElement).value).toBe('');
			expect((getByTestId('registration-repeatPassword-input') as HTMLInputElement).value).toBe('');
			expect((getByTestId('registration-firstName-input') as HTMLInputElement).value).toBe('');
			expect((getByTestId('registration-lastName-input') as HTMLInputElement).value).toBe('');
			expect((getByTestId('registration-license-checkbox') as HTMLInputElement).checked).toEqual(false);
			expect((getByTestId('registration-isMaster-checkbox') as HTMLInputElement).checked).toEqual(false);
		});
	});

	it('should triggers event handlers on UI elements, post order on submit', async () => {
		const {getByTestId, getByLabelText, findByText} = renderWithRouter({
			component: <Registration />,
			path: '/registration-form',
		});

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

		fireEvent.mouseDown(getByLabelText('Cities'));
		const choosenCityOptionOdessa = await findByText('Odessa');
		const choosenCityOptionDnipro = await findByText('Dnipro');
		fireEvent.click(choosenCityOptionOdessa);
		fireEvent.click(choosenCityOptionDnipro);

		const submitButton = await findByText('Submit');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect((getByTestId('registration-email-input') as HTMLInputElement).value).toBe('testRegistration@gmail.com');
			expect((getByTestId('registration-password-input') as HTMLInputElement).value).toBe('TestPassword1!');
			expect((getByTestId('registration-repeatPassword-input') as HTMLInputElement).value).toBe('TestPassword1!');
			expect((getByTestId('registration-firstName-input') as HTMLInputElement).value).toBe('First');
			expect((getByTestId('registration-lastName-input') as HTMLInputElement).value).toBe('Last');
			expect((getByTestId('registration-license-checkbox') as HTMLInputElement).checked).toEqual(true);
			expect((getByTestId('registration-isMaster-checkbox') as HTMLInputElement).checked).toEqual(true);
			expect((getByTestId('registration-cities-select') as HTMLInputElement)).toBeInTheDocument();
			expect((getByTestId('registration-cities-select') as HTMLInputElement).value).toBe('3,1');
			expect(mockAxios.history.post.length).toBe(1);
			expect(mockAxios.history.post[0].data).toBe(JSON.stringify({
				email: 'testRegistration@gmail.com',
				name: 'First Last',
				password: 'TestPassword1!',
				citiesId: [3, 1],
				role: 'master',
			}));
		});
	});
});
