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
				type: Sequelize.DataTypes.STRING(40),
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
				type: Sequelize.DataTypes.STRING(5000),
				allowNull: false,
			},

			createdAt: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},

			updatedAt: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},
		});
	},

	down: async (queryInterface) => {
		await queryInterface.dropTable('blog');
	},
};
