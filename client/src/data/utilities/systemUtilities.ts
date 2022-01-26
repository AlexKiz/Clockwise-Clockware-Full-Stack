import {Clock} from './../types/types';

export const getOrderOptions = (clocks: Clock[], orderDate: string, orderTime:string, clockId: number) => {
	const currentClock = clocks.filter((clock) => clock.id === clockId);

	const {installationTime, price, size} = currentClock[0];

	const startDate = new Date(`${orderDate} ${orderTime}`);

	const endDate = new Date(`${orderDate} ${orderTime}`);

	startDate.setUTCHours(startDate.getHours());
	endDate.setUTCHours(endDate.getHours() + installationTime);

	const orderOptions: Array<string | number> = [];

	orderOptions.push(endDate.toISOString());
	orderOptions.push(startDate.toISOString());
	orderOptions.push(price);
	orderOptions.push(size);

	return orderOptions;
};

export const getBinaryImages = async (images: File[]) => {
	const binaryImages = await Promise.all<Promise<string | ArrayBuffer | null>[]>(
		images.map(async (file) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onerror = () => {
					const error = reader.error;
					reject(error);
				};
				reader.onload = () => {
					const result = reader.result;
					resolve(result);
				};
			});
		}));

	return binaryImages;
};
