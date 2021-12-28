import {VALID} from 'src/data/constants/systemConstants';

export interface CityCreateProps {};

export interface CityCreateFormValues {
	cityName: string
	cityId: number
}

export type CityCreateFormValidation = {
	cityName?: string
}

export const validate = (values: CityCreateFormValues) => {
	const errors: CityCreateFormValidation = {};
	if (!values.cityName) {
		errors.cityName = 'Required';
	} else if (!VALID.CITY.test(values.cityName)) {
		errors.cityName = 'City name must be at least 3 letter and alphabetical only';
	}
	return errors;
};
