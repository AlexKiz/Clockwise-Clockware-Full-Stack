import {VALID} from '../../../data/constants/systemConstants';

export interface LoginFormProps {};

export interface LoginFormValues {
	userLogin: string
	userPassword: string
}

export type LoginFormValidation = {
	userLogin?: string,
	userPassword?: string,
}

export const validate = (values: LoginFormValues) => {
	const errors: LoginFormValidation = {};
	if (!values.userLogin) {
		errors.userLogin = 'Required';
	} else if (!VALID.EMAIL.test(values.userLogin)) {
		errors.userLogin = 'Email should match the example: myemail@mail.com';
	}
	return errors;
};
