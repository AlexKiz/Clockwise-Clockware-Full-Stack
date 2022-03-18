import React from 'react';
import LoginForm from './LoginForm';

import {render} from '@testing-library/react';

it('matches snapshot', () => {
	const {asFragment} = render(<LoginForm />);

	expect(asFragment()).toMatchSnapshot();
});
