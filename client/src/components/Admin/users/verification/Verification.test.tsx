import React from 'react';
import Verification from './Verification';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<Verification />);

	expect(asFragment()).toMatchSnapshot();
});
