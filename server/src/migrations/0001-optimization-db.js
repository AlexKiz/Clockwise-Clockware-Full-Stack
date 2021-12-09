/* eslint-disable max-len */
'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		const transaction = await queryInterface.sequelize.transaction();
		try {
			await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";', {transaction});

			await queryInterface.addColumn('users', 'newId', {
				type: Sequelize.DataTypes.UUID,
				allowNull: false,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			}, {transaction});
			await queryInterface.addColumn('masters', 'newId', {
				type: Sequelize.DataTypes.UUID,
				allowNull: false,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			}, {transaction});
			await queryInterface.addColumn('orders', 'newId', {
				type: Sequelize.DataTypes.UUID,
				allowNull: false,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			}, {transaction});

			await queryInterface.removeConstraint('orders', 'orders_userId_fkey', {transaction});
			await queryInterface.removeConstraint('orders', 'orders_masterId_fkey', {transaction});
			await queryInterface.removeConstraint('master_cities', 'master_cities_masterId_fkey', {transaction});
			await queryInterface.removeConstraint('master_cities', 'master_cities_pkey', {transaction});
			await queryInterface.removeConstraint('orders', 'orders_pkey', {transaction});
			await queryInterface.removeConstraint('users', 'users_pkey', {transaction});
			await queryInterface.removeConstraint('masters', 'masters_pkey', {transaction});

			await queryInterface.addColumn('orders', 'newUserId', {
				type: Sequelize.DataTypes.UUID,
			}, {transaction});
			await queryInterface.addColumn('orders', 'newMasterId', {
				type: Sequelize.DataTypes.UUID,
			}, {transaction});
			await queryInterface.addColumn('master_cities', 'newMasterId', {
				type: Sequelize.DataTypes.UUID,
			}, {transaction});

			await queryInterface.sequelize.query('UPDATE orders T SET "newUserId" = (SELECT newId FROM users WHERE id = T.id;', {transaction});
			await queryInterface.sequelize.query('UPDATE orders T SET "newMasterId" = (SELECT newId FROM masters WHERE id = T.id;', {transaction});
			await queryInterface.sequelize.query('UPDATE master_cities T SET "newMasterId" = (SELECT newId FROM masters WHERE id = T."masterId";', {transaction});

			await queryInterface.removeColumn('user', 'id', {transaction});
			await queryInterface.removeColumn('master', 'id', {transaction});
			await queryInterface.removeColumn('order', 'id', {transaction});
			await queryInterface.removeColumn('master_cities', 'masterId', {transaction});

			await queryInterface.renameColumn('user', 'newId', 'id', {transaction});
			await queryInterface.renameColumn('masters', 'newId', 'id', {transaction});
			await queryInterface.renameColumn('orders', 'newId', 'id', {transaction});
			await queryInterface.renameColumn('master_cities', 'newMasterId', 'masterId', {transaction});
			await queryInterface.renameColumn('orders', 'newMasterId', 'masterId', {transaction});
			await queryInterface.renameColumn('orders', 'newUserId', 'userId', {transaction});

			await queryInterface.changeColumn('orders', 'masterId', {
				allowNull: false,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}, {transaction});

			await queryInterface.changeColumn('orders', 'userId', {
				allowNull: false,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}, {transaction});

			await queryInterface.changeColumn('master_cities', 'masterId', {
				allowNull: false,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}, {transaction});

			await queryInterface.sequelize.query('ALTER TABLE IF EXISTS public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id)', {transaction});
			await queryInterface.sequelize.query('ALTER TABLE IF EXISTS public.orders ADD CONSTRAINT orders_pkey PRIMARY KEY (id)', {transaction});
			await queryInterface.sequelize.query('ALTER TABLE IF EXISTS public.masters ADD CONSTRAINT masters_pkey PRIMARY KEY (id)', {transaction});

			await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.orders
												ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId")
												REFERENCES public.users (id) MATCH SIMPLE
												ON UPDATE CASCADE
												ON DELETE CASCADE;`, {transaction});

			await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.orders
												ADD CONSTRAINT "orders_masterId_fkey" FOREIGN KEY ("masterId")
												REFERENCES public.masters (id) MATCH SIMPLE
												ON UPDATE CASCADE
												ON DELETE CASCADE;`, {transaction});

			await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.master_cities
												ADD CONSTRAINT "orders_masterId_fkey" FOREIGN KEY ("masterId")
												REFERENCES public.masters (id) MATCH SIMPLE
												ON UPDATE CASCADE
												ON DELETE CASCADE;`, {transaction});

			await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.master_cities
												ADD CONSTRAINT "master_cities_masterId_fkey" FOREIGN KEY ("masterId")
												REFERENCES public.masters (id) MATCH SIMPLE
												ON UPDATE CASCADE
												ON DELETE CASCADE;`, {transaction});

			await queryInterface.sequelize.query(`ALTER TABLE IF EXISTS public.master_cities
												ADD CONSTRAINT master_cities_pkey PRIMARY KEY ("masterId", "cityId");`, {transaction});


			await queryInterface.addColumn('users', 'password', {
				type: Sequelize.DataTypes.STRING(100),
				allowNull: false,
			}, {transaction});

			await queryInterface.addColumn('users', 'role', {
				type: Sequelize.DataTypes.STRING(30),
				allowNull: false,
			}, {transaction});

			await queryInterface.dropTable('admin', {transaction});

			await queryInterface.removeColumn('masters', 'ratedSum', {transaction});

			await queryInterface.removeColumn('masters', 'ratedQuantity', {transaction});

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
