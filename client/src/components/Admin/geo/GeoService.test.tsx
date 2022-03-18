import React from 'react';
import GeoService from './GeoService';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<GeoService />);

	expect(asFragment()).toMatchSnapshot();
});
