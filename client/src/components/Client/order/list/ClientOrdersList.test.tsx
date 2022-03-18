import React from 'react';
import ClientOrdersList from './ClientOrdersList';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<ClientOrdersList />);

	expect(asFragment()).toMatchSnapshot();
});
