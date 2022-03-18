import React from 'react';
import Article from './Article';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<Article />);

	expect(asFragment()).toMatchSnapshot();
});
