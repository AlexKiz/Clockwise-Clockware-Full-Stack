/* eslint-disable react/react-in-jsx-scope */
import {render, screen} from '@testing-library/react';
import App from './App';
import '@types/jest';

test('renders learn react link', () => {
	render(<App />);
	const linkElement = screen.getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
