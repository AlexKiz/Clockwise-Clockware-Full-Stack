import React from 'react';
import UsersList from './UsersList';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<UsersList />);

	expect(asFragment()).toMatchSnapshot();
});
