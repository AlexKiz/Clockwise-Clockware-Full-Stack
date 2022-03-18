import React from 'react';
import PrivateRoute from './PrivateRoute';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<PrivateRoute />); // TODO: props

	expect(asFragment()).toMatchSnapshot();
});
