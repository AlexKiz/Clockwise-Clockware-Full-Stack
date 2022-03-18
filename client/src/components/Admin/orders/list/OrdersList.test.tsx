import React from 'react';
import OrdersList from './OrdersList';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<OrdersList />);

	expect(asFragment()).toMatchSnapshot();
});
