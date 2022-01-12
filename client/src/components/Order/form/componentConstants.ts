import {VALID} from 'src/data/constants/systemConstants';

export interface OrderFormProps {}

export interface OrderFormValues {
	name: string
	email: string
	cityId: number
	clockId: number
	orderDate: string
	orderTime: string
	masterId: string
	orderPhotos: string[]
}

export type OrderFormValidation = {
	name?: string,
	email?: string,
	clockId?: string,
	cityId?: string,
	orderTime?: string,
	orderDate?: string,
	masterId?: string
}

const requiredFields: string[] = ['name', 'email', 'clockId', 'cityId', 'orderTime', 'orderDate', 'masterId'];

export const validate = (values: OrderFormValues) => {
	const errors: OrderFormValidation = {};

	if (!VALID.NAME.test(values.name)) {
		errors.name = 'User name must be at least 3 letter and alphabetical characters only.';
	}

	if (!VALID.EMAIL.test(values.email)) {
		errors.email = 'Email should match the example: myemail@mail.com';
	}

	requiredFields.some((field) => {
		if (!values[field]) {
			errors[field] = 'Required';
		}
	});

	return errors;
};
