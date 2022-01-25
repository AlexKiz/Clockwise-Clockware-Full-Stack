import {Clock} from './../types/types';

export const getOrderDates = (clocks: Clock[], orderDate: string, orderTime:string, clockId: number) => {
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
};

export const getBinaryImages = async (images: File[]) => {
	const binaryImages = await Promise.all<Promise<string | ArrayBuffer | null>[]>(
		images.map(async (file) => {
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => {
					const result = reader.result;
					resolve(result);
				};
			});
		}));

	return binaryImages;
};
