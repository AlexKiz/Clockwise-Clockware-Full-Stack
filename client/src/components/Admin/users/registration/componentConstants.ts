import {VALID} from '../../../../data/constants/systemConstants';

export interface RegistrationProps {};

export interface RegistrationValues {
    email: string
    firstName: string
    lastName: string
    password: string
    checkPassword: string
    isMaster: boolean
	licenseAcception: boolean
    citiesId?: number[]
}

export type RegistrationValidation = {
	email?: string,
    firstName?: string,
    lastName?: string,
    password?: string,
    checkPassword?: string,
    isMaster?: string,
	licenseAcception?: string,
    citiesId?: string,
}

const requiredFields: string[] = ['email', 'firstName', 'lastName', 'password', 'checkPassword'];

export const validate = (values: RegistrationValues) => {
	const errors: RegistrationValidation = {};

	if (!VALID.EMAIL.test(values.email)) {
		errors.email = 'Email should match the example: myemail@mail.com';
	}

	if (!VALID.PASSWORD.test(values.password)) {
		errors.password = 'Password must contains at least 1 special symbol, 1 number, upper and lower case letters';
	} else if (values.password.length < 8) {
		errors.password = 'Password must be at least 8 characters';
	}

	if (values.checkPassword !== values.password) {
		errors.checkPassword = 'Password does not match';
	}

	if (values.isMaster && !values.citiesId?.length) {
		errors.citiesId = 'Required';
	}

	if (!values.licenseAcception) {
		errors.licenseAcception = 'You must accept license term to sign in';
	}

	requiredFields.some((field) => {
		if (!values[field]) {
			errors[field] = 'Required';
		}
	});

	return errors;
};
