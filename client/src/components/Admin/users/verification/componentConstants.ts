import {VALID} from 'src/data/constants/systemConstants';

export interface VerificationProps {}

export interface RegistrationFormValues {
    password: string
    checkPassword: string
}

export type RegistrationFormValidation = {
    password?: string,
    checkPassword?: string,
}

export const validate = (values: RegistrationFormValues) => {
	const errors: RegistrationFormValidation = {};

	if (!values.password) {
		errors.password = 'Required';
	} else if (!VALID.PASSWORD.test(values.password)) {
		errors.password = 'Password must contains at least 1 special symbol, upper and lower case letters';
	} else if (values.password.length < 8) {
		errors.password = 'Password must be at least 8 characters';
	}

	if (!values.checkPassword) {
		errors.checkPassword = 'Required';
	} else if (values.checkPassword !== values.password) {
		errors.checkPassword = 'Password does not match';
	}

	return errors;
};
