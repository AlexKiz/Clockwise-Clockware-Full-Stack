import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();
import app from '../../index';
import {URL} from '../../../data/constants/routeConstants';
import db from '../../models/index';
import {Op} from 'sequelize';

chai.use(chaiHttp);

describe('Master API', () => {
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
		await db.User.destroy({where: {email: 'adminTest@gmail.com'}});
		await db.Master.destroy({where: {id: '01542709-69ad-46be-9646-8d5d97d2528c'}});
		await db.Master.destroy({where: {name: 'Master One'}});
		await db.MasterCities.destroy({where: {masterId: '01542709-69ad-46be-9646-8d5d97d2528c'}});
	});

	it('should create a new master', (done) => {
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
					.post(`${URL.API}${URL.MASTER}`)
					.set('Authorization', `${token}`)
					.send({
						name: 'Master One',
						citiesId: [1, 2],
					}).end((err, res) => {
						res.should.have.status(201);
						res.should.be.json;
						res.body.should.be.a('object');
						res.body.should.have.property('id');
						res.body.should.have.property('name');
						res.body.name.should.equal('Master One');
						res.body.should.have.property('rating');
						done();
					});
			});
	});

	it('should fetch all masters with pagination', (done) => {
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
					.get(`${URL.API}${URL.MASTER}`)
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
						res.body.rows[0].should.have.property('name');
						res.body.rows[0].should.have.property('rating');
						res.body.rows[0].should.have.property('cities');
						res.body.rows[0].should.be.a('object');
						res.body.rows[0].should.have.property('id');
						res.body.rows[0].should.have.property('name');
						done();
					});
			});
	});

	it('should fetch all masters with name', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'adminTest@gmail.com',
				password: 'AdminTest1!Password',
			})
			.end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app).get(`${URL.API}${URL.MASTER}`)
					.query({
						masterName: 'Master One',
						limit: 10,
						offset: 0,
					})
					.set('Authorization', `${token}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.have.property('id');
						res.body[0].should.have.property('name');
						res.body[0].should.have.property('rating');
						res.body[0].should.have.property('cities');
						res.body[0].cities.should.be.a('array');
						done();
					});
			});
	});

	it('should fetch all masters', (done) => {
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
					.get(`${URL.API}${URL.MASTER}`)
					.set('Authorization', `${token}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.have.property('id');
						res.body[0].should.have.property('name');
						res.body[0].should.have.property('rating');
						res.body[0].should.have.property('cities');
						res.body[0].cities.should.be.a('array');
						done();
					});
			});
	});

	it('should fetch all available masters', (done) => {
		chai.request(app)
			.get(`${URL.API}${URL.AVAILABLE_MASTER}`)
			.query({
				cityId: 1,
				startWorkOn: '2024-03-23T00:00:00.978Z',
				endWorkOn: '2024-03-23T02:00:00.978Z',
			}).end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('id');
				res.body[0].should.have.property('name');
				res.body[0].should.have.property('rating');
				done();
			});
	});

	it('should update master', (done) => {
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
					.put(`${URL.API}${URL.MASTER}`)
					.set('Authorization', `${token}`)
					.send({
						id: '01542709-69ad-46be-9646-8d5d97d2528c',
						name: 'Master Tes',
						citiesId: [1, 2],
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.be.a('object');
						res.body[0].should.have.property('id');
						res.body[0].id.should.be.equal('01542709-69ad-46be-9646-8d5d97d2528c');
						res.body[0].should.have.property('name');
						res.body[0].name.should.be.equal('Master Tes');
						done();
					});
			});
	});

	it('should delete master', (done) => {
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
					.delete(`${URL.API}${URL.MASTER}`)
					.set('Authorization', `${token}`)
					.send({
						id: '01542709-69ad-46be-9646-8d5d97d2528c',
					}).end((err, res) => {
						res.should.have.status(204);
						done();
					});
			});
	});
});
