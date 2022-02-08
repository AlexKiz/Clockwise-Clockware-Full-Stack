'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('blog', {
			id: {
				type: Sequelize.DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			title: {
				type: Sequelize.DataTypes.STRING(75),
				allowNull: false,
			},

			pictures: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},

			background: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},

			description: {
				type: Sequelize.DataTypes.STRING(170),
				allowNull: false,
			},

			body: {
				type: Sequelize.DataTypes.STRING(3350),
				allowNull: false,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('blog');
	},
};
