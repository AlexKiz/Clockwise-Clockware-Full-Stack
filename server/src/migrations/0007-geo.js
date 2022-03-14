'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.createTable('geo', {
				id: {
					type: Sequelize.DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true,
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				},

				cityId: {
					type: Sequelize.DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: {
							tableName: 'cities',
						},
						key: 'id',
					},
					onDelete: 'CASCADE',
					onUpdate: 'CASCADE',
				},

				lat: {
					type: Sequelize.DataTypes.DECIMAL,
					allowNull: true,
				},

				lng: {
					type: Sequelize.DataTypes.DECIMAL,
					allowNull: true,
				},
			}, {transaction});

			await queryInterface.addColumn('orders', 'orderAddress', {
				type: Sequelize.DataTypes.STRING,
				allowNull: true,
			}, {transaction});

			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	},

	down: async (queryInterface) => {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.dropTable('geo', {transaction});
			await queryInterface.removeColumn('orders', 'orderAddress', {transaction});
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	},
};
