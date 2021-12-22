import {VALID} from '../../../../data/constants/systemConstants';

export interface RegistrationFormProps {};

export interface RegistrationFormValues {
    userEmail: string
    userFirstName: string
    userLastName: string
    password: string
    checkPassword: string
    isMaster: boolean
	licenseAcception: boolean
    citiesId?: number[]
}

export type RegistrationFormValidation = {
	userEmail?: string,
    userFirstName?: string,
    userLastName?: string,
    password?: string,
    checkPassword?: string,
    isMaster?: string,
	licenseAcception?: string,
    citiesId?: string,
}

export const validate = (values: RegistrationFormValues) => {
	const errors: RegistrationFormValidation = {};
	if (!values.userEmail) {
		errors.userEmail = 'Required';
	} else if (!VALID.EMAIL.test(values.userEmail)) {
		errors.userEmail = 'Email should match the example: myemail@mail.com';
	}

	if (!values.userFirstName) {
		errors.userFirstName = 'Required';
	}

	if (!values.userLastName) {
		errors.userLastName = 'Required';
	}

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

	if (values.isMaster && !values.citiesId?.length) {
		errors.citiesId = 'Required';
	}

	if (!values.licenseAcception) {
		errors.licenseAcception = 'You must accept license term to sign in';
	}

	return errors;
};
