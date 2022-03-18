import React from 'react';
import OrderForm from './OrderForm';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<OrderForm />);

	expect(asFragment()).toMatchSnapshot();
});
