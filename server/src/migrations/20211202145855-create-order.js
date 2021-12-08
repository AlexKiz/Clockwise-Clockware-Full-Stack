'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('orders', {
			id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			clock_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Clock,
					key: 'id',
				},
			},

			user_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: User,
					key: 'id',
				},
			},

			city_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: City,
					key: 'id',
				},
			},

			master_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Master,
					key: 'id',
				},
			},

			start_work_on: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},

			end_work_on: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},

			rating_identificator: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},

			order_rating: {
				type: Sequelize.DataTypes.REAL,
				defaultValue: 0,
			},

		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('orders');
	},
};
