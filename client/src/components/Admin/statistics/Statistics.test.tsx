import React from 'react';
import Statistics from './Statistics';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<Statistics />);

	expect(asFragment()).toMatchSnapshot();
});
