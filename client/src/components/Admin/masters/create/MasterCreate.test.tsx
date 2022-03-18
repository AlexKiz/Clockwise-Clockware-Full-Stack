import React from 'react';
import MasterCreate from './MasterCreate';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<MasterCreate />);

	expect(asFragment()).toMatchSnapshot();
});
