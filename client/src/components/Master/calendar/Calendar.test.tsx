import React from 'react';
import Calendar from './Calendar';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<Calendar />);

	expect(asFragment()).toMatchSnapshot();
});
