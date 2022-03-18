import React from 'react';
import TablePaginationActions from './TablePaginationActions';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<TablePaginationActions />);

	expect(asFragment()).toMatchSnapshot();
});
