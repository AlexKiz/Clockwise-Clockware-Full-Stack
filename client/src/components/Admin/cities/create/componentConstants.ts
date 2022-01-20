import {VALID} from 'src/data/constants/systemConstants';

export interface CityCreateProps {}

export interface CityCreateFormValues {
	name: string
	id: number
}

export type CityCreateFormValidation = {
	name?: string
}

export const validate = (values: CityCreateFormValues) => {
	const errors: CityCreateFormValidation = {};
	if (!values.name) {
		errors.name = 'Required';
	} else if (!VALID.CITY.test(values.name)) {
		errors.name = 'City name must be at least 3 letter and alphabetical only';
	}
	return errors;
};
