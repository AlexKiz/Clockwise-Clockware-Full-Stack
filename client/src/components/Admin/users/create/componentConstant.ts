import {VALID} from 'src/data/constants/systemConstants';

export interface UserCreateProps {}

export interface UserCreateFormValues {
	name: string
	id: string
    email: string
}

export type UserCreateFormValidation = {
	name?: string
    email?: string
}

export const validate = (values: UserCreateFormValues) => {
	const errors: UserCreateFormValidation = {};

	if (!values.name) {
		errors.name = 'Required';
	} else if (!VALID.NAME.test(values.name)) {
		errors.name = 'User name must be at least 3 letter and alphabetical characters only';
	}
	if (!values.email) {
		errors.email = 'Required';
	} else if (!VALID.EMAIL.test(values.email)) {
		errors.email = 'Email should match the example: myemail@mail.com';
	}
	return errors;
};
