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

		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
		});

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

		await queryInterface.createTable('masters', {
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

			rating: {
				type: Sequelize.DataTypes.REAL,
				allowNull: false,
				defaultValue: 0,
			},

			rated_sum: {
				type: Sequelize.DataTypes.REAL,
				allowNull: false,
				defaultValue: 0,
			},

			rated_quantity: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
		});

		await queryInterface.createTable('master_cities', {
			master_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: {
						tableName: 'masters',
					},
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			city_id: {
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
		});

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
					model: {
						tableName: 'clocks',
					},
					key: 'id',
				},
			},

			user_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: {
						tableName: 'users',
					},
					key: 'id',
				},
			},

			city_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: {
						tableName: 'cities',
					},
					key: 'id',
				},
			},

			master_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: {
						tableName: 'masters',
					},
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
		await queryInterface.dropTable('admin');
		await queryInterface.dropTable('users');
		await queryInterface.dropTable('cities');
		await queryInterface.dropTable('clocks');
		await queryInterface.dropTable('masters');
		await queryInterface.dropTable('master_cities');
		await queryInterface.dropTable('orders');
	},
};
