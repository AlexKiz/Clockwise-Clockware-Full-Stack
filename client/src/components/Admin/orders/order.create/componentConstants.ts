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

export const validate = (values: OrderCreateFormValues) => {
	const errors: OrderCreateFormValidation = {};
	if (!values.userId) {
		errors.userId = 'Required';
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
