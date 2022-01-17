export interface OrderCreateProps {}

export interface OrderCreateFormValues {
    orderId: string
    userId: string
	cityId: number
	clockId: number
	orderDate: string
	orderTime: string
	masterId: string
}

export type OrderCreateFormValidation = {
    userId?: string
	clockId?: string,
	cityId?: string,
	orderTime?: string,
	orderDate?: string,
	masterId?: string
}

const requiredFields: string[] = ['userId', 'clockId', 'cityId', 'orderTime', 'orderDate', 'masterId'];

export const validate = (values: OrderCreateFormValues) => {
	const errors: OrderCreateFormValidation = {};

	requiredFields.some((field) => {
		if (!values[field]) {
			errors[field] = 'Required';
		}
	});

	return errors;
};
