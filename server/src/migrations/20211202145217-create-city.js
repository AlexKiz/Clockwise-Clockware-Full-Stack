'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('cities', {
			id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			name: {
				type: Sequelize.DataTypes.STRING(100),
				allowNull: false,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('cities');
	},
};
