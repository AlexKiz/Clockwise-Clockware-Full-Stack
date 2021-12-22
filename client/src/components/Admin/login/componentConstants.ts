import {VALID} from '../../../data/constants/systemConstants';

export interface LoginFormProps {};

export interface LoginFormValues {
	adminLogin: string
	adminPassword: string
}

export type LoginFormValidation = {
	adminLogin?: string,
	adminPassword?: string,
}

export const validate = (values: LoginFormValues) => {
	const errors: LoginFormValidation = {};
	if (!values.adminLogin) {
		errors.adminLogin = 'Required';
	} else if (!VALID.EMAIL.test(values.adminLogin)) {
		errors.adminLogin = 'Email should match the example: myemail@mail.com';
	}
	return errors;
};
