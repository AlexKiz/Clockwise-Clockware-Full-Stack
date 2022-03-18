import React from 'react';
import Blog from './Blog';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<Blog />);

	expect(asFragment()).toMatchSnapshot();
});
