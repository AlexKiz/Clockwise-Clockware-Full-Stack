import React from 'react';
import PrivateHeader from './PrivateHeader';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<PrivateHeader />);

	expect(asFragment()).toMatchSnapshot();
});
