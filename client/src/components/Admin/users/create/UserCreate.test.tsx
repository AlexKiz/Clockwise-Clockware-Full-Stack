import React from 'react';
import UserCreate from './UserCreate';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<UserCreate />);

	expect(asFragment()).toMatchSnapshot();
});
