'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.removeColumn('masters', 'ratedSum', {transaction});
			await queryInterface.removeColumn('masters', 'ratedQuantity', {transaction});
			await queryInterface.changeColumn('masters', 'id', {
				type: Sequelize.DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: UUID4,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}, {transaction});
			await queryInterface.changeColumn('users', 'id', {
				type: Sequelize.DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: UUID4,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}, {transaction});
			await queryInterface.changeColumn('orders', 'id', {
				type: Sequelize.DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: UUID4,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	},

	async down(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.addColumn('masters', 'ratedSum',
				{
					type: DataTypes.REAL,
					allowNull: false,
					defaultValue: 0,
				},
				{transaction});
			await queryInterface.addColumn('masters', 'ratedQuantity',
				{
					type: DataTypes.INTEGER,
					allowNull: false,
					defaultValue: 0,
				},
				{transaction});
			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	},
};
