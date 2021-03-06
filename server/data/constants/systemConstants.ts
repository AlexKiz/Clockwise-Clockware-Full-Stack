/* eslint-disable max-len */
export const VALID = {
	CITY_NAME: new RegExp(/^[A-Za-zА-Яа-я]{3,100}$|^[A-Za-zА-Яа-я]{3,49}[-\s]{1}[A-Za-zА-Яа-я]{3,50}$/),
	MASTER_NAME: new RegExp(/^([(A-Za-zА-Яа-я]{3,49})$|^([A-Za-zА-Яа-я]{3,49}[\s]{1}[A-Za-zА-Яа-я]{3,50})$/),
	USER_NAME: new RegExp(/^([(A-Za-zА-Яа-я]{3,49})$|^([A-Za-zА-Яа-я]{3,49}[\s]{1}[A-Za-zА-Яа-я]{3,50})$/),
	USER_EMAIL: new RegExp(/^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
	DATE: new RegExp(/(\d{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}\d{1}|3[0-1]{1})|([0-2]{1}\d{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-]\d{4})[T]([0-2]{1}\d{1}[:][0-5]{1}\d{1})[:]([0-5]{1}\d{1})[.]([0-5]{1}\d{2}[Z])/),
	PASSWORD: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
};

export const METHOD = 'OPTIONS';

export const FONTS = {
	Times: {
		normal: 'Times-Roman',
		bold: 'Times-Bold',
		italics: 'Times-Italic',
		bolditalics: 'Times-BoldItalic',
	},
};
