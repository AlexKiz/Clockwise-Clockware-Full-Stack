import React from 'react';
import RateOrder from './RateOrder';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<RateOrder />);

	expect(asFragment()).toMatchSnapshot();
});
