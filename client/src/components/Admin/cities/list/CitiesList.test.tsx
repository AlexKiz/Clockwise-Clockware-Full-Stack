import React from 'react';
import CitiesList from './CitiesList';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<CitiesList />);

	expect(asFragment()).toMatchSnapshot();
});
