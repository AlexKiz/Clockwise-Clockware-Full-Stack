import React from 'react';
import MastersList from './MastersList';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<MastersList />);

	expect(asFragment()).toMatchSnapshot();
});
