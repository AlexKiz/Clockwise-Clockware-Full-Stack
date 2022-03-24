import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
const should = chai.should();
import app from '../../index';
import {URL} from '../../../data/constants/routeConstants';
import db from '../../models/index';
import {Op} from 'sequelize';

chai.use(chaiHttp);

describe('Blog API', () => {
	before(async () => {
		await db.Blog.create({
			id: '01543809-69ad-46be-9646-8d5d97d2528c',
			title: 'Article title test',
			description: 'Description article test',
			background: 'http://res.cloudinary.com/dplgyedon/image/upload/v1645655016/dyf6zilxns4lzfpczi7b.jpg',
			body: '<p>Hello test</p>',
		});
		await db.User.create({
			name: 'Admin Test',
			email: 'adminTest@gmail.com',
			password: '$2a$10$Bz/eR2BfLkGnL6FMCoobae2/I9ogjgK/sBz3O4ZXH0752NnDg8lxG',
			role: 'admin',
			masterId: null,
			hashVerify: '',
			isVerified: true,
		});
	});

	after(async () => {
		await db.User.destroy({where: {email: 'adminTest@gmail.com'}});
		await db.Blog.destroy({where: {id: '01543809-69ad-46be-9646-8d5d97d2528c'}});
		await db.Blog.destroy({where: {title: 'Article test title 1'}});
	});

	it('should create new article', (done) => {
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
					.post(`${URL.API}${URL.BLOG}`)
					.set('Authorization', `${token}`)
					.send({
						title: 'Article test title 1',
						description: 'Article test description',
						background: [],
						body: '<p>Test 1<em>content</em></p>',
					})
					.end((err, res) => {
						res.should.have.status(201);
						res.should.be.json;
						res.body.should.be.a('object');
						res.body.should.have.property('title');
						res.body.title.should.be.equal('Article test title 1');
						res.body.should.have.property('description');
						res.body.description.should.be.equal('Article test description');
						res.body.should.have.property('background');
						res.body.background.should.be.equal('');
						res.body.should.have.property('body');
						res.body.body.should.be.equal('<p>Test 1<em>content</em></p>');
						done();
					});
			});
	});

	it('should fetch all articles', (done) => {
		chai.request(app)
			.get(`${URL.API}${URL.BLOG}`)
			.query({
				limit: 5,
				offset: 0,
			}).end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('count');
				res.body.should.have.property('rows');
				res.body.rows.should.be.a('array');
				res.body.rows[0].should.have.property('id');
				res.body.rows[0].should.have.property('title');
				res.body.rows[0].should.have.property('background');
				res.body.rows[0].should.have.property('description');
				res.body.rows[0].should.have.property('body');
				done();
			});
	});

	it('should fetch the article', (done) => {
		chai.request(app)
			.get(`${URL.API}${URL.ARTICLE}`)
			.query({
				articleTitle: 'Article title test',
			}).end((err, res) => {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('id');
				res.body.should.have.property('title');
				res.body.title.should.be.equal('Article title test');
				res.body.should.have.property('background');
				res.body.should.have.property('description');
				res.body.should.have.property('body');
				done();
			});
	});

	it('should fetch article for update', (done) => {
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
					.get(`${URL.API}${URL.ARTICLE_FOR_UPDATE}`)
					.set('Authorization', `${token}`)
					.query({
						title: 'Article title test',
					}).end((err, res) => {
						res.should.have.status(200);
						res.should.be.json;
						res.body.should.be.a('object');
						res.body.should.have.property('id');
						res.body.should.have.property('title');
						res.body.title.should.be.equal('Article title test');
						res.body.should.have.property('background');
						res.body.should.have.property('description');
						res.body.should.have.property('body');
						done();
					});
			});
	});

	it('should update article', (done) => {
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
					.put(`${URL.API}${URL.BLOG}`)
					.set('Authorization', `${token}`)
					.send({
						id: '01543809-69ad-46be-9646-8d5d97d2528c',
						title: 'Article title test',
						description: 'Description article test',
						background: 'http://res.cloudinary.com/dplgyedon/image/upload/v1645655016/dyf6zilxns4lzfpczi7b.jpg',
						body: '<p>Hello test</p>',
					}).end((err, res) => {
						res.should.have.status(201);
						res.should.be.json;
						res.body.should.be.a('array');
						res.body[0].should.equal(1);
						done();
					});
			});
	});

	it('should delete article', (done) => {
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
					.delete(`${URL.API}${URL.BLOG}`)
					.set('Authorization', `${token}`)
					.send({
						id: '01543809-69ad-46be-9646-8d5d97d2528c',
					}).end((err, res) => {
						res.should.have.status(204);
						done();
					});
			});
	});
});
