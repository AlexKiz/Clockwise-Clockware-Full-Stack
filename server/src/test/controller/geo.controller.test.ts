import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();
import app from '../../index';
import {URL} from '../../../data/constants/routeConstants';
import db from '../../models/index';
import {Op} from 'sequelize';

chai.use(chaiHttp);

describe('Geo API', () => {
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
			name: 'Dnipro',
		});
	});

	after(async () => {
		await db.User.destroy({where: {email: 'adminTest@gmail.com'}});
		await db.City.destroy({where: {id: 1}});
	});

	it('should create polygon coordinates', (done) => {
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
					.post(`${URL.API}${URL.GEO_COORDINATES}`)
					.set('Authorization', `${token}`)
					.send({
						coordinates: [{
							lat: 43.454545,
							lng: 45.434343,
						}, {
							lat: 56.585858,
							lng: 58.565656,
						}, {
							lat: 69.656565,
							lng: 65.696969,
						}],
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.have.property('lat');
						res.body[0].lat.should.be.equal('43.454545');
						res.body[0].should.have.property('lng');
						res.body[0].lng.should.be.equal('45.434343');
						done();
					});
			});
	});

	it('should fetch polygon coordinates', (done) => {
		chai.request(app)
			.get(`${URL.API}${URL.GEO_COORDINATES}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('lat');
				res.body[0].should.have.property('lng');
				done();
			});
	});
});
