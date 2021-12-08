'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('admin', {
			id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			email: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},

			password: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('admin');
	},
};
