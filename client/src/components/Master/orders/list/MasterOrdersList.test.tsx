import React from 'react';
import MasterOrdersList from './MasterOrdersList';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<MasterOrdersList />);

	expect(asFragment()).toMatchSnapshot();
});
