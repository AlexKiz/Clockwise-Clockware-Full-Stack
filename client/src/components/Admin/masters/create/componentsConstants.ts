import {VALID} from 'src/data/constants/systemConstants';

export interface MasterCreateProps {}

export interface MasterCreateFormValues {
    masterId: string
	masterName: string
	citiesId: number[]
}

export type MasterCreateFormValidation = {
	masterName?: string
    citiesId?: string
}

export const validate = (values: MasterCreateFormValues) => {
	const errors: MasterCreateFormValidation = {};
	if (!values.masterName) {
		errors.masterName = 'Required';
	} else if (!VALID.NAME.test(values.masterName)) {
		errors.masterName = 'Master name must be at least 3 letter and alphabetical only';
	}
	if (!values.citiesId.length) {
		errors.citiesId = 'Required';
	}
	return errors;
};
