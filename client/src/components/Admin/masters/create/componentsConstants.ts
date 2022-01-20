import {VALID} from 'src/data/constants/systemConstants';

export interface MasterCreateProps {}

export interface MasterCreateFormValues {
    id: string
	name: string
	citiesId: number[]
}

export type MasterCreateFormValidation = {
	name?: string
    citiesId?: string
}

export const validate = (values: MasterCreateFormValues) => {
	const errors: MasterCreateFormValidation = {};
	if (!values.name) {
		errors.name = 'Required';
	} else if (!VALID.NAME.test(values.name)) {
		errors.name = 'Master name must be at least 3 letter and alphabetical only';
	}
	if (!values.citiesId.length) {
		errors.citiesId = 'Required';
	}
	return errors;
};
