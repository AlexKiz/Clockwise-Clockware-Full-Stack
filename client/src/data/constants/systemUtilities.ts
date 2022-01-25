/* eslint-disable require-jsdoc */
import {useCallback, useRef} from 'react';

export function debouncer(callback, delay: number) {
	const timer = useRef<null | NodeJS.Timer>(null);

	const debouncedCallback = useCallback((...args) => {
		if (timer.current) {
			clearTimeout(timer.current);
		}

		timer.current = setTimeout(() => {
			callback(...args);
		}, delay);
	}, [callback, delay]);

	return debouncedCallback;
}
