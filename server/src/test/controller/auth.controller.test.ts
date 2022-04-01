import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();
import app from '../../index';
import {URL} from '../../../data/constants/routeConstants';
import db from '../../models/index';
import {Op} from 'sequelize';

chai.use(chaiHttp);

describe('Auth API', () => {
	before(async () => {
		await db.User.create({
			id: '0f06b9cc-11a9-4c1b-b769-dcf717ee9fe6',
			name: 'User One',
			email: 'userOne@gmail.com',
			password: '$2a$10$G6kZA89n38OF6d0wX2/u5.0EMlqk7YVq.RIJdEoA0jrkWBHsNuEk6',
			role: 'client',
			masterId: null,
			hashVerify: '',
			isVerified: true,
		});
		await db.User.create({
			id: '107a1561-152f-43e7-9eed-ac7714ff7f58',
			name: 'User Two',
			email: 'userTwo@gmail.com',
			password: '$2a$10$8KSUl1tJGlhTlCD1eGw.X.tiSD35HndNkLjvezjdrI/Jqc1yqqHlC',
			role: 'client',
			masterId: null,
			hashVerify: '$2b$10$eJAQWDzeemoV6QNkP3J86eRyJcSZHYidpDsjiyvBg1k2WQ2knyYWG',
			isVerified: false,
			token: null,
		});
		await db.User.create({
			id: 'b4055452-f6b5-479e-8080-0d504d1d3d8b',
			name: 'admin',
			email: 'admin@gmail.com',
			password: '$2b$10$O6xKC3xAEGWqkoId/cU7aO/IwErpoNkE0miiJgRlFCvcj8LBjayEW',
			role: 'admin',
			masterId: null,
			hashVerify: '',
			isVerified: true,
			token: null,
		});
	});

	after(async () => {
		await db.User.destroy({where: {id: {[Op.in]: [
			'0f06b9cc-11a9-4c1b-b769-dcf717ee9fe6',
			'107a1561-152f-43e7-9eed-ac7714ff7f58',
			'b4055452-f6b5-479e-8080-0d504d1d3d8b',
		]}}});
	});

	it('should login with right credential', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'userOne@gmail.com',
				password: 'UserOne1!Test',
			})
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('message');
				res.body.message.should.equal('Successfully authorizated!');
				done();
			});
	});

	it('should not login unathorizated user', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'UnAuthUser@gmail.com',
				password: 'SomeRandomPassword',
			}).end((err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('message');
				res.body.message.should.equal('Wrong data');
				done();
			});
	});

	it('should not login unverified user', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'userTwo@gmail.com',
				password: 'UserTwo2!Test',
			}).end((err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('message');
				res.body.message.should.equal('You need to verify your email first!');
				done();
			});
	});

	it('should not login with wrong credentials', (done) => {
		chai.request(app)
			.post(`${URL.API}${URL.LOGIN}`)
			.send({
				login: 'userOne@gmail.com',
				password: 'UserTwo1!Secret',
			}).end((err, res) => {
				res.should.have.status(400);
				res.body.should.have.property('message');
				res.body.message.should.equal('Wrong login or password');
				done();
			});
	});
});

