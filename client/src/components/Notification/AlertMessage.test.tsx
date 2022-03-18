import React from 'react';
import AlertMessage from './AlertMessage';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<AlertMessage />);// TODO: props

	expect(asFragment()).toMatchSnapshot();
});
