import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

export const customRender = (ui, options?) => {
	return render(ui, {wrapper: MemoryRouter, ...options});
};

