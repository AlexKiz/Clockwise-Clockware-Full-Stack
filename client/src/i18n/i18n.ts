import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		debug: true,
		fallbackLng: 'en',
		resources: {
			en: {
				translation: {
					form: {
						name: 'Enter your name:',
						email: 'Enter your email:',
						clock: 'Choose clock size:',
						city: 'Choose your city:',
						date: 'Choose the date:',
						time: 'Choose the time:',
						master: 'Available masters:',
					},
					login: {
						userLogin: 'Enter User Login:',
						userPassword: 'Enter User Password:',
					},
					registration: {
						email: 'Enter Email:',
						password: 'Enter Password:',
						name: 'Enter your name:',
						city: 'Choose cities:',
					},
					labels: {
						name: 'Full name',
						email: 'Email',
						size: 'Size',
						city: 'City',
						cities: 'Cities',
						time: 'Time',
						master: 'Choose the master',
						password: 'Password',
						confirmPassword: 'Confirm password',
						firstName: 'First Name',
						lastName: 'Last Name',
						licenseTerm: '*Accept the license terms',
						asMaster: 'Sign up as master',
					},
					buttons: {
						upload: 'Upload Photos',
						show: 'Uploaded Photos',
						create: 'Create Order',
						signIn: 'Sign In',
						submit: 'Submit',
					},
					header: {
						make: 'Make order',
						login: 'Log in',
						signUp: 'Sign up',
					},
				},
			},
			ru: {
				translation: {
					form: {
						name: 'Введите ваше имя:',
						email: 'Введите ваш эмейл:',
						clock: 'Выберите размер часов:',
						city: 'Выберите ваш город:',
						date: 'Выберите дату:',
						time: 'Выберите время:',
						master: 'Свободные мастера:',
					},
					login: {
						userLogin: 'Введите логин:',
						userPassword: 'Введите пароль:',
					},
					registration: {
						email: 'Введите эмейл',
						password: 'Введите пароль',
						name: 'Введите имя',
						city: 'Выберите города',
					},
					labels: {
						name: 'Имя Фамилия',
						email: 'Эмейл',
						size: 'Размер',
						city: 'Город',
						cities: 'Города',
						time: 'Время',
						master: 'Выберите мастера',
						password: 'Пароль',
						confirmPassword: 'Потдвердите пароль',
						firstName: 'Имя',
						lastName: 'Фамилия',
						licenseTerm: '*Принять условия соглашения',
						asMaster: 'Зарегистрироваться как мастер',
					},
					buttons: {
						upload: 'Загрузить фото',
						show: 'Выбранные фото',
						create: 'Создать заказ',
						signIn: 'Войти',
						submit: 'Подтвердить',
					},
					header: {
						make: 'Создание заказа',
						login: 'Войти',
						signUp: 'Регистрация',
					},
				},
			},
			ukr: {
				translation: {
					form: {
						name: 'Введіть ваше ім\'я:',
						email: 'Введіть ваш емейл:',
						clock: 'Виберіть розмір годинника:',
						city: 'Виберіть ваше місто:',
						date: 'Виберіть дату:',
						time: 'Виберіть час:',
						master: 'Вільні майстри:',
					},
					login: {
						userLogin: 'Введіть логін:',
						userPassword: 'Введіть пароль:',
					},
					registration: {
						email: 'Введіть емейл',
						password: 'Введіть пароль',
						name: 'Введіть ім\'я',
						city: 'Виберіть міста',
					},
					labels: {
						name: 'Ім\'я прізвище',
						email: 'Емейл',
						size: 'Розмір',
						city: 'Місто',
						cities: 'Міста',
						time: 'Час',
						master: 'Виберіть майстра',
						password: 'Пароль',
						confirmPassword: 'Підтвердіть пароль',
						firstName: 'Ім\'я',
						lastName: 'Прізвище',
						licenseTerm: '*Прийняти умови угоди',
						asMaster: 'Зареєструватись як майстер',
					},
					buttons: {
						upload: 'Завантажити фото',
						show: 'Вибрані фото',
						create: 'Створити замовлення',
						signIn: 'Увійти',
						submit: 'Підтвердити',
					},
					header: {
						make: 'Створення замовлення',
						login: 'Увійти',
						signUp: 'Реєстрація',
					},
				},
			},
		},
		detection: {
			order: ['cookie'],
			caches: ['cookie'],
		},
	});


export default i18n;
