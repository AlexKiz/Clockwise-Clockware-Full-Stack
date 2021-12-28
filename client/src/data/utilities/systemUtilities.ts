/* eslint-disable require-jsdoc */
import {Clock} from './../types/types';

export function getOrderDates(clocks: Clock[], orderDate: string, orderTime:string, clockId: number) {
	const currentClock = clocks.filter((clock) => clock.id === clockId);

	const {installationTime} = currentClock[0];

	const startDate = new Date(`${orderDate} ${orderTime}`);

	const endDate = new Date(`${orderDate} ${orderTime}`);

	startDate.setUTCHours(startDate.getHours());
	endDate.setUTCHours(endDate.getHours() + installationTime);

	const orderDates: string[] = [];

	orderDates.push(startDate.toISOString());
	orderDates.push(endDate.toISOString());

	return orderDates;
}
