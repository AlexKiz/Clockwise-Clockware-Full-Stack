export interface OrderFormProps {}
import {VALID} from 'src/data/constants/systemConstants';

export interface OrderFormProps {}

export interface OrderFormValues {
	userName: string
	userEmail: string
	cityId: number
	clockId: number
	orderDate: string
	orderTime: string
	masterId: string
}

export type OrderFormValidation = {
	userName?: string,
	userEmail?: string,
	clockId?: string,
	cityId?: string,
	orderTime?: string,
	orderDate?: string,
	masterId?: string
}

const requiredFields: string[] = ['userName', 'userEmail', 'clockId', 'cityId', 'orderTime', 'orderDate', 'masterId'];

export const validate = (values: OrderFormValues) => {
	const errors: OrderFormValidation = {};

	if (!VALID.NAME.test(values.userName)) {
		errors.userName = 'User name must be at least 3 letter and alphabetical characters only.';
	}

	if (!VALID.EMAIL.test(values.userEmail)) {
		errors.userEmail = 'Email should match the example: myemail@mail.com';
	}

	requiredFields.some((field) => {
		if (!values[field]) {
			errors[field] = 'Required';
		}
	});

	return errors;
};
