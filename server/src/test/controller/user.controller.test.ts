import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();
import app from '../../index';
import {URL} from '../../../data/constants/routeConstants';
import db from '../../models/index';
import {Op} from 'sequelize';

chai.use(chaiHttp);

describe('User API', () => {
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
		await db.User.create({
			id: '01542609-69ad-46be-9646-8d5d97d2528c',
			name: 'User Test',
			email: 'userTest@gmail.com',
			password: '$2a$10$Bz/eR2BfLkGnL6FMCoobae2/I9ogjgK/sBz3O4ZXH0752NnDg8lxG',
			role: 'client',
			masterId: null,
			hashVerify: '',
			isVerified: true,
		});
	});

	after(async () => {
		await db.User.destroy({where: {email: 'adminTest@gmail.com'}});
		await db.City.destroy({where: {id: {[Op.in]: [1, 2]}}});
		await db.User.destroy({where: {email: 'ClientTest@gmail.com'}});
		await db.User.destroy({where: {email: 'MasterTest@gmail.com'}});
		await db.User.destroy({where: {id: '01542609-69ad-46be-9646-8d5d97d2528c'}});
	});

	it('should register and verified user as client', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.REGISTRATION}`)
			.send({
				name: 'Client Test',
				email: 'ClientTest@gmail.com',
				password: 'ClientTest1!',
				citiesId: [],
				role: 'client',
			})
			.end((err, res) => {
				res.should.have.status(201);
				res.should.be.json;
				res.should.be.a('object');
				res.body.should.have.property('name');
				res.body.name.should.be.equal('Client Test');
				res.body.should.have.property('email');
				res.body.email.should.be.equal('ClientTest@gmail.com');
				res.body.should.have.property('password');
				res.body.should.have.property('role');
				res.body.role.should.be.equal('client');
				res.body.should.have.property('hashVerify');
				const hash = res.body.hashVerify;
				chai.request(app)
					.put(`${URL.API}${URL.VERIFY}`)
					.send({
						hashVerify: hash,
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.be.equal(1);
						done();
					});
			});
	});

	it('should register and verified user as master', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.REGISTRATION}`)
			.send({
				name: 'Master Test',
				email: 'MasterTest@gmail.com',
				password: 'MasterTest1!',
				citiesId: [1, 2],
				role: 'master',
			}).end((err, res) => {
				res.should.have.status(201);
				res.should.be.json;
				res.should.be.a('object');
				res.body.should.have.property('name');
				res.body.name.should.be.equal('Master Test');
				res.body.should.have.property('email');
				res.body.email.should.be.equal('MasterTest@gmail.com');
				res.body.should.have.property('password');
				res.body.should.have.property('role');
				res.body.role.should.be.equal('master');
				res.body.should.have.property('masterId');
				res.body.should.have.property('hashVerify');
				const hash = res.body.hashVerify;
				chai.request(app)
					.put(`${URL.API}${URL.VERIFY}`)
					.send({
						hashVerify: hash,
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.be.equal(1);
						done();
					});
			});
	});

	it('should fetch all users with pagination', (done) => {
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
					.get(`${URL.API}${URL.USER}`)
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
						res.body.rows[0].should.have.property('email');
						done();
					});
			});
	});

	it('should fetch all users', (done) => {
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
					.get(`${URL.API}${URL.USER}`)
					.set('Authorization', `${token}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.have.property('id');
						res.body[0].should.have.property('name');
						res.body[0].should.have.property('email');
						done();
					});
			});
	});

	it('should update user', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'adminTest@gmail.com',
				password: 'AdminTest1!Password',
			}).end((err, res) => {
				res.should.have.status(200);
				const token = res.header.authorization;
				chai.request(app)
					.put(`${URL.API}${URL.USER}`)
					.set('Authorization', `${token}`)
					.send({
						id: '01542609-69ad-46be-9646-8d5d97d2528c',
						name: 'User Update',
						email: 'userUpdate@gmail.com',
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.equal(1);
						done();
					});
			});
	});

	it('should delete user', (done) => {
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
					.delete(`${URL.API}${URL.USER}`)
					.set('Authorization', `${token}`)
					.send({
						id: '01542609-69ad-46be-9646-8d5d97d2528c',
					}).end((err, res) => {
						res.should.have.status(204);
						done();
					});
			});
	});
});
