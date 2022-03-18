import React from 'react';
import ArticlesList from './ArticlesList';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<ArticlesList />);

	expect(asFragment()).toMatchSnapshot();
});
