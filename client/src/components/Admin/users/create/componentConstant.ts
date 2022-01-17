import {VALID} from 'src/data/constants/systemConstants';

export interface UserCreateProps {}

export interface UserCreateFormValues {
	userName: string
	userId: string
    userEmail: string
}

export type UserCreateFormValidation = {
	userName?: string
    userEmail?: string
}

export const validate = (values: UserCreateFormValues) => {
	const errors: UserCreateFormValidation = {};

	if (!values.userName) {
		errors.userName = 'Required';
	} else if (!VALID.NAME.test(values.userName)) {
		errors.userName = 'User name must be at least 3 letter and alphabetical characters only';
	}
	if (!values.userEmail) {
		errors.userEmail = 'Required';
	} else if (!VALID.EMAIL.test(values.userEmail)) {
		errors.userEmail = 'Email should match the example: myemail@mail.com';
	}
	return errors;
};
