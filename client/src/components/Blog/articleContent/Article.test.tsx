import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Article from './Article';
import {cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../data/constants/routeConstants';
import {renderWithRouterAndParams} from '../../../data/constants/test-utilities';

const article = {
	background: 'http://res.cloudinary.com/dplgyedon/image/upload/v1646413172/m2kybjtg5iezgcvdhy6k.jpg',
	body: '<p>Test Article Body 1</p>',
	createdAt: '2022-03-04T16:59:33.588Z',
	description: 'Test Article Description 1',
	id: 'd0ba340a-012f-43d6-8772-f55f27b513df',
	title: 'Test Article Title 1',
	updatedAt: '2022-03-04T16:59:33.588Z',
};

describe('Article', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		mockAxios.onGet(URL.ARTICLE).reply(200, article);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		const {asFragment} = renderWithRouterAndParams({
			component: <Article />,
			pathWithParamValue: '/admin/cities-list/Test%20Article%20Title 1',
			pathWithParamName: '/admin/cities-list/:articleTitle',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component fetched data within', async () => {
		const {getByText} = renderWithRouterAndParams({
			component: <Article />,
			pathWithParamValue: '/admin/cities-list/Test%20Article%20Title 1',
			pathWithParamName: '/admin/cities-list/:articleTitle',
		});

		await waitFor(() => {
			expect(getByText('Test Article Body 1')).toBeInTheDocument();
		});
	});
});

