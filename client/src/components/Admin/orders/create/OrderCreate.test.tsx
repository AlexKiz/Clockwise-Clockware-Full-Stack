import React from 'react';
import OrderCreate from './OrderCreate';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<OrderCreate />);

	expect(asFragment()).toMatchSnapshot();
});
