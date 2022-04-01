import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ArticleCreate from './ArticleCreate';
import {fireEvent, cleanup, waitFor} from '@testing-library/react';
import {URL} from '../../../../data/constants/routeConstants';
import {renderWithRouter, renderWithRouterAndParams} from '../../../../data/constants/test-utilities';

const articleForUpdate = {
	background: 'http://res.cloudinary.com/dplgyedon/image/upload/v1646413172/m2kybjtg5iezgcvdhy6k.jpg',
	body: '<p>Test Article Body 1</p>',
	createdAt: '2022-03-04T16:59:33.588Z',
	description: 'Test Article Description 1',
	id: 'd0ba340a-012f-43d6-8772-f55f27b513df',
	title: 'Test Article Title 1',
	updatedAt: '2022-03-04T16:59:33.588Z',
};

describe('Article Create', () => {
	let mockAxios;

	beforeEach(() => {
		mockAxios = new MockAdapter(axios);
		jest.mock('react-router-dom', () => ({
			useHistory: () => ({
				push: jest.fn(),
			}),
		}));
		mockAxios.onGet(URL.ARTICLE_FOR_UPDATE).reply(200, articleForUpdate);
		mockAxios.onPost(URL.BLOG).reply(201);
		mockAxios.onPut(URL.BLOG).reply(200);
	});

	afterEach(() => {
		mockAxios.reset();
		cleanup();
	});

	it('matches snapshot', async () => {
		const {asFragment} = renderWithRouter({
			component: <ArticleCreate />,
			path: '/admin/articles-create',
		});
		await waitFor(() => {
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it('should render update component', async () => {
		const {getByTestId} = renderWithRouterAndParams({
			component: <ArticleCreate />,
			pathWithParamValue: '/admin/city-create/Test%20Article%20Title%201',
			pathWithParamName: '/admin/city-create/:articleTitle',
		});

		await waitFor(() => {
			expect((getByTestId('article-title-input') as HTMLInputElement).value).toBe('Test Article Title 1');
			expect((getByTestId('article-description-input') as HTMLInputElement).value).toBe('Test Article Description 1');
		});
	});

	it('should update fetched article', async () => {
		const {getByTestId} = renderWithRouterAndParams({
			component: <ArticleCreate />,
			pathWithParamValue: '/admin/city-create/Test%20Article%20Title%201',
			pathWithParamName: '/admin/city-create/:articleTitle',
		});

		fireEvent.change(getByTestId('article-title-input'), {
			target: {value: 'Test Updated Article Title 1'},
		});

		fireEvent.change(getByTestId('article-description-input'), {
			target: {value: 'Test Updated Article Description 1'},
		});

		fireEvent.click(getByTestId('article-form-submit'));

		await waitFor(() => {
			expect((getByTestId('article-title-input') as HTMLInputElement).value).toBe('Test Updated Article Title 1');
			expect((getByTestId('article-description-input') as HTMLInputElement).value).toBe('Test Updated Article Description 1');
		});
		expect(mockAxios.history.put.length).toBe(1);
		expect(mockAxios.history.put[0].data).toBe(JSON.stringify({
			background: 'http://res.cloudinary.com/dplgyedon/image/upload/v1646413172/m2kybjtg5iezgcvdhy6k.jpg',
			body: '<p>Test Article Body 1</p>',
			createdAt: '2022-03-04T16:59:33.588Z',
			description: 'Test Updated Article Description 1',
			id: 'd0ba340a-012f-43d6-8772-f55f27b513df',
			title: 'Test Updated Article Title 1',
			updatedAt: '2022-03-04T16:59:33.588Z',
		}));
	});
});
