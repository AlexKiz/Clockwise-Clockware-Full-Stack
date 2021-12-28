'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('admin', [{
			email: 'admin@example.com',
			password: '$2b$10$O6xKC3xAEGWqkoId/cU7aO/IwErpoNkE0miiJgRlFCvcj8LBjayEW',
		}], {});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('admin', null, {});
	},
};
