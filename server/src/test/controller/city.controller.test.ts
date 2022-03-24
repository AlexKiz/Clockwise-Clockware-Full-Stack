import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();
import app from '../../index';
import {URL} from '../../../data/constants/routeConstants';
import db from '../../models/index';
import {Op} from 'sequelize';

chai.use(chaiHttp);

describe('City API', () => {
	before(async () => {
		await db.City.create({
			id: 1,
			name: 'City One',
		});
		await db.City.create({
			id: 2,
			name: 'City Two',
		});
		await db.User.create({
			name: 'Admin Test',
			email: 'adminTest@gmail.com',
			password: '$2a$10$Bz/eR2BfLkGnL6FMCoobae2/I9ogjgK/sBz3O4ZXH0752NnDg8lxG', // AdminTest1!Password
			role: 'admin',
			masterId: null,
			hashVerify: '',
			isVerified: true,
		});
		await db.Master.create({
			id: '01542709-69ad-46be-9646-8d5d97d2528c',
			name: 'Master Test',
		});
		await db.MasterCities.create({
			cityId: 1,
			masterId: '01542709-69ad-46be-9646-8d5d97d2528c',
		});
	});

	after(async () => {
		await db.City.destroy({where: {id: {[Op.in]: [1, 2]}}});
		await db.City.destroy({where: {name: 'Dnipro'}});
		await db.User.destroy({where: {email: 'adminTest@gmail.com'}});
		await db.Master.destroy({where: {id: '01542709-69ad-46be-9646-8d5d97d2528c'}});
		await db.MasterCities.destroy({where: {masterId: '01542709-69ad-46be-9646-8d5d97d2528c'}});
	});


	it('should create a new city', (done) => {
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
					.post(`${URL.API}${URL.CITY}`)
					.set('Authorization', `${token}`)
					.send({
						name: 'Dnipro',
					}).end((err, res) => {
						res.should.have.status(201);
						res.should.be.json;
						res.body.should.be.a('object');
						res.body.should.have.property('name');
						res.body.name.should.equal('Dnipro');
						done();
					});
			});
	});

	it('should fetch all cities with pagination', (done) => {
		chai.request(app)
			.get(`${URL.API}${URL.CITY}`)
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
				res.body.rows[0].should.have.property('name');
				done();
			});
	});

	it('should fetch all cities with name', (done) => {
		chai.request(app)
			.get(`${URL.API}${URL.CITY}`)
			.query({
				cityName: 'City Two',
				limit: 10,
				offset: 0,
			}).end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('id');
				res.body[0].should.have.property('name');
				done();
			});
	});

	it('should fetch all cities', (done) => {
		chai.request(app)
			.get(`${URL.API}${URL.CITY}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('id');
				res.body[0].should.have.property('name');
				done();
			});
	});

	it('should fetch city for update', (done) => {
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
					.get(`${URL.API}${URL.CITY_FOR_UPDATE}`)
					.set('Authorization', `${token}`)
					.query({
						name: 'City One',
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('object');
						res.body.should.have.property('id');
						res.body.should.have.property('name');
						done();
					});
			});
	});

	it('should fetch cities for order', (done) => {
		chai.request(app)
			.get(`${URL.API}${URL.CITY_FOR_ORDER}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('id');
				res.body[0].should.have.property('name');
				done();
			});
	});

	it('should update city', (done) => {
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
					.put(`${URL.API}${URL.CITY}`)
					.set('Authorization', `${token}`)
					.send({
						id: 1,
						name: 'City Ont',
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.equal(1);
						done();
					});
			});
	});

	it('should delete city', (done) => {
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
					.delete(`${URL.API}${URL.CITY}`)
					.set('Authorization', `${token}`)
					.send({
						id: 1,
					}).end((err, res) => {
						res.should.have.status(204);
						done();
					});
			});
	});
});
