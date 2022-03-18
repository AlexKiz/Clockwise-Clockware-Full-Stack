import React from 'react';
import MapAutocomplete from './MapAutocomplete';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<MapAutocomplete />); // TODO: props

	expect(asFragment()).toMatchSnapshot();
});
