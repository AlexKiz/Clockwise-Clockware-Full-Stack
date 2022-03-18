import React from 'react';
import ArticleCreate from './ArticleCreate';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<ArticleCreate />);

	expect(asFragment()).toMatchSnapshot();
});
