import {VALID} from '../../../data/constants/systemConstants';

export interface LoginFormProps {}

export interface LoginFormValues {
	login: string
	password: string
}

export type LoginFormValidation = {
	login?: string,
	password?: string,
}

export const validate = (values: LoginFormValues) => {
	const errors: LoginFormValidation = {};
	if (!values.login) {
		errors.login = 'Required';
	} else if (!VALID.EMAIL.test(values.login)) {
		errors.login = 'Email should match the example: myemail@mail.com';
	}
	return errors;
};
