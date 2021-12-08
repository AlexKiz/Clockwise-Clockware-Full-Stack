'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('clocks', {
			id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			size: {
				type: Sequelize.DataTypes.STRING(20),
				allowNull: false,
			},

			price: {
				type: Sequelize.DataTypes.INTEGER,
			},

			installation_time: {
				type: Sequelize.DataTypes.INTEGER,

			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('clocks');
	},
};
