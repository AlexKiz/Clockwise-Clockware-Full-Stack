import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();
import app from '../../index';
import {URL} from '../../../data/constants/routeConstants';
import db from '../../models/index';
import {Op} from 'sequelize';
import {postOrder} from '../../../data/utilities/systemUtilities';

chai.use(chaiHttp);

describe('Order API', () => {
	before(async () => {
		await db.User.create({
			name: 'Admin Test',
			email: 'adminTest@gmail.com',
			password: '$2a$10$Bz/eR2BfLkGnL6FMCoobae2/I9ogjgK/sBz3O4ZXH0752NnDg8lxG',
			role: 'admin',
			masterId: null,
			hashVerify: '',
			isVerified: true,
		});
		await db.City.create({
			id: 1,
			name: 'City One',
		});
		await db.City.create({
			id: 2,
			name: 'City Two',
		});
		await db.Clock.create({
			id: 1,
			size: 'small',
			price: 1,
			installationTime: 1,
		});
		await db.Clock.create({
			id: 2,
			size: 'medium',
			price: 2,
			installationTime: 2,
		});
		await db.Clock.create({
			id: 3,
			size: 'large',
			price: 3,
			installationTime: 3,
		});
		await db.Master.create({
			id: '01542709-69ad-46be-9646-8d5d97d2528c',
			name: 'Master Test',
		});
		await db.MasterCities.create({
			cityId: 1,
			masterId: '01542709-69ad-46be-9646-8d5d97d2528c',
		});
		await db.User.create({
			id: '5c8adaf1-b8aa-459b-a853-a4abdae1a1d5',
			name: 'Master Test',
			email: 'masterTest@gmail.com',
			password: '$2a$10$G6kZA89n38OF6d0wX2/u5.0EMlqk7YVq.RIJdEoA0jrkWBHsNuEk6',
			role: 'master',
			masterId: '01542709-69ad-46be-9646-8d5d97d2528c',
			hashVerify: '',
			isVerified: true,
		});
		await db.User.create({
			id: '62c19404-5155-4f56-98eb-f4326c023990',
			name: 'Client Test',
			email: 'clientTest@gmail.com',
			password: '$2a$10$8KSUl1tJGlhTlCD1eGw.X.tiSD35HndNkLjvezjdrI/Jqc1yqqHlC',
			role: 'client',
			masterId: null,
			hashVerify: '',
			isVerified: true,
		});
		await db.Order.create({
			id: '10457290-96da-64eb-6964-8d5d97d2528c',
			clockId: 1,
			userId: '62c19404-5155-4f56-98eb-f4326c023990',
			cityId: 1,
			masterId: '01542709-69ad-46be-9646-8d5d97d2528c',
			startWorkOn: '2024-03-24T00:00:00.978Z',
			endWorkOn: '2024-03-24T01:00:00.978Z',
			ratingIdentificator: '8d3109a9-9ff2-4b78-ad1b-1172b11db95f',
			paymentDate: new Date().toISOString(),
			orderImages: '',
			orderAddress: '',
		});
	});

	after(async () => {
		await db.User.destroy({where: {email: 'adminTest@gmail.com'}});
		await db.Clock.destroy({where: {id: {[Op.in]: [1, 2, 3]}}});
		await db.Master.destroy({where: {id: '01542709-69ad-46be-9646-8d5d97d2528c'}});
		await db.MasterCities.destroy({where: {masterId: '01542709-69ad-46be-9646-8d5d97d2528c'}});
		await db.User.destroy({where: {email: 'masterTest@gmail.com'}});
		await db.User.destroy({where: {email: 'clientTest@gmail.com'}});
		await db.Order.destroy({where: {id: '10457290-96da-64eb-6964-8d5d97d2528c'}});
		await db.City.destroy({where: {id: {[Op.in]: [1, 2]}}});
	});

	it('should create new order', async () => {
		const createdOrder = await postOrder({
			name: 'Client Test',
			email: 'clientTest@gmail.com',
			clockId: '1',
			cityId: '1',
			masterId: '01542709-69ad-46be-9646-8d5d97d2528c',
			startWorkOn: '2024-03-23T00:00:00.000Z',
			endWorkOn: '2024-03-23T01:00:00.000Z',
			orderimages: '',
			orderAddress: '',
		});
		expect(createdOrder).should.be.a('object');
		expect(createdOrder).to.have.property('id');
		expect(createdOrder).to.have.property('clockId');
		expect(createdOrder).to.have.property('userId');
		expect(createdOrder).to.have.property('cityId');
		expect(createdOrder).to.have.property('masterId');
		expect(createdOrder).to.have.property('startWorkOn');
		expect(createdOrder).to.have.property('endWorkOn');
		expect(createdOrder).to.have.property('ratingIdentificator');
		expect(createdOrder).to.have.property('paymentDate');
		expect(createdOrder).to.have.property('orderImages');
		expect(createdOrder).to.have.property('orderAddress');
		expect(createdOrder.clockId).to.be.equal(1);
		expect(createdOrder.cityId).to.be.equal(1);
		expect(createdOrder.masterId).to.be.equal('01542709-69ad-46be-9646-8d5d97d2528c');
		expect(createdOrder.startWorkOn.toISOString()).to.be.equal('2024-03-23T00:00:00.000Z');
		expect(createdOrder.endWorkOn.toISOString()).to.be.equal('2024-03-23T01:00:00.000Z');
		expect(createdOrder.orderImages).to.be.equal('');
		expect(createdOrder.orderAddress).to.be.equal('');
	});

	it('should fetch all orders for admin', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'adminTest@gmail.com',
				password: 'AdminTest1!Password',
			}).end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.get(`${URL.API}${URL.ORDER}`)
					.set('Authorization', `${token}`)
					.query({
						limit: 5,
						offset: 0,
						sortedField: 'id',
						sortingOrder: 'asc',
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('object');
						res.body.should.have.property('count');
						res.body.should.have.property('rows');
						res.body.rows.should.be.a('array');
						res.body.rows[0].should.have.property('id');
						res.body.rows[0].should.have.property('startWorkOn');
						res.body.rows[0].should.have.property('endWorkOn');
						res.body.rows[0].should.have.property('ratingIdentificator');
						res.body.rows[0].should.have.property('isCompleted');
						res.body.rows[0].should.have.property('images');
						res.body.rows[0].should.have.property('paymentDate');
						res.body.rows[0].should.have.property('clock');
						res.body.rows[0].clock.should.be.a('object');
						res.body.rows[0].clock.should.have.property('id');
						res.body.rows[0].clock.should.have.property('size');
						res.body.rows[0].clock.should.have.property('price');
						res.body.rows[0].should.have.property('user');
						res.body.rows[0].user.should.be.a('object');
						res.body.rows[0].user.should.have.property('id');
						res.body.rows[0].user.should.have.property('name');
						res.body.rows[0].user.should.have.property('email');
						res.body.rows[0].should.have.property('city');
						res.body.rows[0].city.should.be.a('object');
						res.body.rows[0].city.should.have.property('id');
						res.body.rows[0].city.should.have.property('name');
						res.body.rows[0].should.have.property('master');
						res.body.rows[0].master.should.be.a('object');
						res.body.rows[0].master.should.have.property('id');
						res.body.rows[0].master.should.have.property('name');
						done();
					});
			});
	});

	it('should fetch all orders for master', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'masterTest@gmail.com',
				password: 'UserOne1!Test',
			}).end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.get(`${URL.API}${URL.ORDER}`)
					.set('Authorization', `${token}`)
					.query({
						limit: 5,
						offset: 0,
						sortedField: 'id',
						sortingOrder: 'asc',
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.have.property('id');
						res.body[0].should.have.property('startWorkOn');
						res.body[0].should.have.property('endWorkOn');
						res.body[0].should.have.property('ratingIdentificator');
						res.body[0].should.have.property('isCompleted');
						res.body[0].should.have.property('images');
						res.body[0].should.have.property('paymentDate');
						res.body[0].should.have.property('orderAddress');
						res.body[0].should.have.property('clock');
						res.body[0].clock.should.be.a('object');
						res.body[0].clock.should.have.property('id');
						res.body[0].clock.should.have.property('size');
						res.body[0].clock.should.have.property('price');
						res.body[0].should.have.property('user');
						res.body[0].user.should.be.a('object');
						res.body[0].user.should.have.property('id');
						res.body[0].user.should.have.property('name');
						res.body[0].user.should.have.property('email');
						res.body[0].should.have.property('city');
						res.body[0].city.should.be.a('object');
						res.body[0].city.should.have.property('id');
						res.body[0].city.should.have.property('name');
						res.body[0].should.have.property('master');
						res.body[0].master.should.be.a('object');
						res.body[0].master.should.have.property('id');
						res.body[0].master.should.have.property('name');
						done();
					});
			});
	});

	it('should fetch all orders for client', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'clientTest@gmail.com',
				password: 'UserTwo2!Test',
			}).end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.get(`${URL.API}${URL.ORDER}`)
					.set('Authorization', `${token}`)
					.query({
						limit: 5,
						offset: 0,
						sortedField: 'id',
						sortingOrder: 'asc',
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.have.property('id');
						res.body[0].should.have.property('startWorkOn');
						res.body[0].should.have.property('endWorkOn');
						res.body[0].should.have.property('ratingIdentificator');
						res.body[0].should.have.property('isCompleted');
						res.body[0].should.have.property('orderRating');
						res.body[0].should.have.property('orderAddress');
						res.body[0].should.have.property('clock');
						res.body[0].clock.should.be.a('object');
						res.body[0].clock.should.have.property('id');
						res.body[0].clock.should.have.property('size');
						res.body[0].clock.should.have.property('price');
						res.body[0].should.have.property('master');
						res.body[0].master.should.be.a('object');
						res.body[0].master.should.have.property('id');
						res.body[0].master.should.have.property('name');
						done();
					});
			});
	});

	it('should fetch order for calendar', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'masterTest@gmail.com',
				password: 'UserOne1!Test',
			}).end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.get(`${URL.API}${URL.ORDERS_FOR_CALENDAR}`)
					.set('Authorization', `${token}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.have.property('id');
						res.body[0].should.have.property('title');
						res.body[0].should.have.property('start');
						res.body[0].should.have.property('end');
						res.body[0].should.have.property('clockSize');
						res.body[0].should.have.property('isCompleted');
						res.body[0].should.have.property('clientName');
						res.body[0].should.have.property('clientEmail');
						res.body[0].should.have.property('price');
						res.body[0].should.have.property('ratingIdentificator');
						res.body[0].should.have.property('color');
						done();
					});
			});
	});

	it('should fetch order for update', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'adminTest@gmail.com',
				password: 'AdminTest1!Password',
			}).end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.get(`${URL.API}${URL.ORDER_FOR_UPDATE}`)
					.set('Authorization', `${token}`)
					.query({
						id: '10457290-96da-64eb-6964-8d5d97d2528c',
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('object');
						res.body.should.have.property('id');
						res.body.should.have.property('startWorkOn');
						res.body.should.have.property('endWorkOn');
						res.body.should.have.property('ratingIdentificator');
						res.body.should.have.property('isCompleted');
						res.body.should.have.property('clock');
						res.body.clock.should.be.a('object');
						res.body.clock.should.have.property('id');
						res.body.clock.should.have.property('size');
						res.body.should.have.property('user');
						res.body.user.should.be.a('object');
						res.body.user.should.have.property('id');
						res.body.user.should.have.property('name');
						res.body.user.should.have.property('email');
						res.body.should.have.property('city');
						res.body.city.should.be.a('object');
						res.body.city.should.have.property('id');
						res.body.city.should.have.property('name');
						res.body.should.have.property('master');
						res.body.master.should.be.a('object');
						res.body.master.should.have.property('id');
						res.body.master.should.have.property('name');
						done();
					});
			});
	});

	it('should fetch order for rate', (done) => {
		chai.request(app)
			.get(`${URL.API}${URL.ORDER_FOR_RATE}`)
			.query({
				ratingIdentificator: '8d3109a9-9ff2-4b78-ad1b-1172b11db95f',
			}).end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('id');
				res.body.should.have.property('startWorkOn');
				res.body.should.have.property('endWorkOn');
				res.body.should.have.property('clock');
				res.body.clock.should.be.a('object');
				res.body.clock.should.have.property('id');
				res.body.clock.should.have.property('size');
				res.body.should.have.property('user');
				res.body.user.should.be.a('object');
				res.body.user.should.have.property('id');
				res.body.user.should.have.property('name');
				res.body.user.should.have.property('email');
				res.body.should.have.property('city');
				res.body.city.should.be.a('object');
				res.body.city.should.have.property('id');
				res.body.city.should.have.property('name');
				res.body.should.have.property('master');
				res.body.master.should.be.a('object');
				res.body.master.should.have.property('id');
				res.body.master.should.have.property('name');
				done();
			});
	});

	it('should fetch order for chart', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'adminTest@gmail.com',
				password: 'AdminTest1!Password',
			})
			.end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.get(`${URL.API}${URL.TOTAL_ORDERS_CHART}`)
					.set('Authorization', `${token}`)
					.query({
						startDate: '2023-03-24T00:00:00.978Z',
						endDate: '2025-03-24T00:00:00.978Z',
						masterFilter: '5c8adaf1-b8aa-459b-a853-a4abdae1a1d5',
						citiesFilter: 1,
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.have.property('orders');
						res.body[0].should.have.property('date');
						done();
					});
			});
	});

	it('should fetch orders for cities pie chart', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'adminTest@gmail.com',
				password: 'AdminTest1!Password',
			})
			.end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.get(`${URL.API}${URL.TOTAL_ORDERS_CITIES_PIE_CHART}`)
					.set('Authorization', `${token}`)
					.query({
						startDate: '2023-03-24T00:00:00.978Z',
						endDate: '2025-03-24T00:00:00.978Z',
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.have.property('orders');
						res.body[0].should.have.property('city');
						done();
					});
			});
	});

	it('should fetch orders for masters pie chart', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'adminTest@gmail.com',
				password: 'AdminTest1!Password',
			})
			.end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.get(`${URL.API}${URL.TOTAL_ORDERS_MASTERS_PIE_CHART}`)
					.set('Authorization', `${token}`)
					.query({
						startDate: '2023-03-24T00:00:00.978Z',
						endDate: '2025-03-24T00:00:00.978Z',
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.have.property('orders');
						res.body[0].should.have.property('master');
						done();
					});
			});
	});

	it('should fetch orders for masters table', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'adminTest@gmail.com',
				password: 'AdminTest1!Password',
			})
			.end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.get(`${URL.API}${URL.MASTERS_STATISTICS_TABLE}`)
					.set('Authorization', `${token}`)
					.query({
						limit: 5,
						offset: 0,
						sortingField: 'name',
						sortingOrder: 'asc',
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('object');
						res.body.should.have.property('count');
						res.body.should.have.property('statistics');
						res.body.statistics.should.be.a('array');
						res.body.statistics[0].should.have.property('id');
						res.body.statistics[0].should.have.property('name');
						res.body.statistics[0].should.have.property('largeClocks');
						res.body.statistics[0].should.have.property('mediumClocks');
						res.body.statistics[0].should.have.property('smallClocks');
						res.body.statistics[0].should.have.property('completed');
						res.body.statistics[0].should.have.property('uncompleted');
						res.body.statistics[0].should.have.property('earnedAmount');
						res.body.statistics[0].should.have.property('rating');
						done();
					});
			});
	});

	it('should fetch all clocks by name', (done) => {
		chai.request(app)
			.get(`${URL.API}${URL.CLOCKS}`)
			.query({
				clockSize: 'small',
			}).end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('id');
				res.body[0].should.have.property('size');
				res.body[0].size.should.be.equal('small');
				res.body[0].should.have.property('price');
				res.body[0].should.have.property('installationTime');
				done();
			});
	});

	it('should fetch all clocks', (done) => {
		chai.request(app)
			.get(`${URL.API}${URL.CLOCKS}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('id');
				res.body[0].should.have.property('size');
				res.body[0].should.have.property('price');
				res.body[0].should.have.property('installationTime');
				done();
			});
	});

	it('should update order', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'adminTest@gmail.com',
				password: 'AdminTest1!Password',
			})
			.end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.put(`${URL.API}${URL.ORDER}`)
					.set('Authorization', `${token}`)
					.send({
						id: '10457290-96da-64eb-6964-8d5d97d2528c',
						clockId: 2,
						userId: '62c19404-5155-4f56-98eb-f4326c023990',
						cityId: 1,
						masterId: '01542709-69ad-46be-9646-8d5d97d2528c',
						startWorkOn: '2024-03-24T00:00:00.000Z',
						endWorkOn: '2024-03-24T02:00:00.000Z',
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.be.equal(1);
						done();
					});
			});
	});

	it('should update rated order', (done) => {
		chai.request(app)
			.put(`${URL.API}${URL.RATED_ORDER}`)
			.send({
				id: '10457290-96da-64eb-6964-8d5d97d2528c',
				orderRated: 4,
				masterId: '01542709-69ad-46be-9646-8d5d97d2528c',
			}).end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.be.equal(1);
				done();
			});
	});

	it('should delete order', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'adminTest@gmail.com',
				password: 'AdminTest1!Password',
			})
			.end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.delete(`${URL.API}${URL.ORDER}`)
					.set('Authorization', `${token}`)
					.send({
						id: '10457290-96da-64eb-6964-8d5d97d2528c',
					}).end((err, res) => {
						res.should.have.status(204);
						done();
					});
			});
	});
});
