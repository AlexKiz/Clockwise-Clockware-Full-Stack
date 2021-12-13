const currentDate = new Date(); // lib fot today
const currentDay = (currentDate.getDate() < 10) ? `0${currentDate.getDate()}` : currentDate.getDate();
const currentMonth = ((currentDate.getMonth() + 1) < 10) ? `0${(currentDate.getMonth() + 1)}` : (currentDate.getMonth() + 1);
const currentYear = currentDate.getFullYear();
export const today = `${currentYear}-${currentMonth}-${currentDay}`;

export const openingHours: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export const ACCESSTOKEN = 'accessToken';

