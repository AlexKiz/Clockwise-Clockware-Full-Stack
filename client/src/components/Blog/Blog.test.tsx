import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Blog from './Blog';
import {cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../data/constants/routeConstants';
import {renderWithRouter} from '../../data/constants/test-utilities';

const articles = [{
	background: 'http://res.cloudinary.com/dplgyedon/image/upload/v1646413172/m2kybjtg5iezgcvdhy6k.jpg',
	body: '<p>Test Article Body 1</p>',
	createdAt: '2022-03-04T16:59:33.588Z',
	description: 'Test Article Description 1',
	id: 'd0ba340a-012f-43d6-8772-f55f27b513df',
	title: 'Test Article Title 1',
	updatedAt: '2022-03-04T16:59:33.588Z',
}, {
	background: 'http://res.cloudinary.com/dplgyedon/image/upload/v1646638794/yv5if7jpdx63cjrzsfn8.png',
	body: '<p>Test Article Body 2</p>',
	createdAt: '2022-03-07T07:39:54.618Z',
	description: 'Test Article Description 2',
	id: 'deaa224b-c370-4398-8fe8-6e3e4478bce1',
	title: 'Test Article Title 2',
	updatedAt: '2022-03-07T07:39:54.618Z',
}, {
	background: 'http://res.cloudinary.com/dplgyedon/image/upload/v1648646008/ewboelvjan2modhbhhfx.jpg',
	body: '<p>Test Article Body 3</p>',
	createdAt: '2022-03-30T13:13:29.427Z',
	description: 'Test Article Description 3',
	id: 'b8482f1a-c491-44ad-aac9-a1386d05f2f4',
	title: 'Test Article Title 3',
	updatedAt: '2022-03-30T14:15:18.790Z',
}];

describe('Blog', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		window.confirm = jest.fn(() => true);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		mockAxios.onGet(URL.BLOG).reply(200, {count: articles.length, rows: articles});

		const {asFragment} = renderWithRouter({
			component: <Blog />,
			path: '/blog',
		});

		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render component with empty list', async () => {
		mockAxios.onGet(URL.BLOG).reply(200, {count: 0, rows: []});

		const {getByTestId} = renderWithRouter({
			component: <Blog />,
			path: '/blog',
		});

		await waitFor(() => {
			expect(getByTestId('no-articles-label')).toBeInTheDocument();
		});
	});

	it('should render component with fetched data', async () => {
		mockAxios.onGet(URL.BLOG).reply(200, {count: articles.length, rows: articles});
		mockAxios.onDelete(URL.BLOG).reply(204);

		const {getAllByTestId} = renderWithRouter({
			component: <Blog />,
			path: '/blog',
		});

		await waitFor(() => {
			expect(getAllByTestId('article-card').length).toBe(3);
		});
	});
});

