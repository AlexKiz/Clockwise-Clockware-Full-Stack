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

export const validate = (values: OrderFormValues) => {
	const errors: OrderFormValidation = {};
	if (!values.userName) {
		errors.userName = 'Required';
	} else if (!VALID.NAME.test(values.userName)) {
		errors.userName = 'User name must be at least 3 letter and alphabetical characters only.';
	}

	if (!values.userEmail) {
		errors.userEmail = 'Required';
	} else if (!VALID.EMAIL.test(values.userEmail)) {
		errors.userEmail = 'Email should match the example: myemail@mail.com';
	}

	if (!values.clockId) {
		errors.clockId = 'Required';
	}

	if (!values.cityId) {
		errors.cityId = 'Required';
	}

	if (!values.orderTime) {
		errors.orderTime = 'Required';
	}

	if (!values.orderDate) {
		errors.orderDate = 'Required';
	}

	if (!values.masterId) {
		errors.masterId = 'Required';
	}

	return errors;
};
