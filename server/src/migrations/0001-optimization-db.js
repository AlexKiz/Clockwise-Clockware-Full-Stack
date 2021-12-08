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
				defaultValue: UUIDV4,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}, {transaction});

			await queryInterface.changeColumn('users', 'id', {
				type: Sequelize.DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: UUIDV4,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}, {transaction});

			await queryInterface.changeColumn('orders', 'id', {
				type: Sequelize.DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: UUIDV4,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}, {transaction});

			await queryInterface.addColumn('users', 'password', {
				type: Sequelize.DataTypes.STRING(100),
				allowNull: false,
			}, {transaction});

			await queryInterface.addColumn('users', 'role', {
				type: Sequelize.DataTypes.STRING(30),
				allowNull: false,
			}, {transaction});

			await queryInterface.dropTable('admin', {transaction});

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

			await queryInterface.changeColumn('masters', 'id', {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}, {transaction});

			await queryInterface.changeColumn('users', 'id', {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}, {transaction});

			await queryInterface.changeColumn('orders', 'id', {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}, {transaction});

			await queryInterface.removeColumn('users', 'password', {transaction});

			await queryInterface.removeColumn('users', 'role', {transaction});

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
			}, {transaction});

			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	},
};
