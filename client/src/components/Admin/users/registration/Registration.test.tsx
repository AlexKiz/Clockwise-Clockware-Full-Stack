import React from 'react';
import Registration from './Registration';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<Registration />);

	expect(asFragment()).toMatchSnapshot();
});
