import React from 'react';
import PublicHeader from './PublicHeader';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<PublicHeader />);

	expect(asFragment()).toMatchSnapshot();
});
