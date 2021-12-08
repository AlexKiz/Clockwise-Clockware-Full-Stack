'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('clocks', [
			{
				id: 1,
				size: 'Small',
				price: 1,
				installation_time: 1,
			},
			{
				id: 2,
				size: 'Medium',
				price: 2,
				installation_time: 2,
			},
			{
				id: 3,
				size: 'Large',
				price: 3,
				installation_time: 3,
			},
		], {});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('clocks', null, {});
	},
};
