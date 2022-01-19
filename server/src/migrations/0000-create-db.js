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

			name: {
				type: Sequelize.DataTypes.STRING(100),
				allowNull: false,
			},

			email: {
				type: Sequelize.DataTypes.STRING(100),
				allowNull: false,
				unique: true,
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

			installationTime: {
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

			ratedSum: {
				type: Sequelize.DataTypes.REAL,
				allowNull: false,
				defaultValue: 0,
			},

			ratedQuantity: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
		});

		await queryInterface.createTable('master_cities', {
			masterId: {
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

			clockId: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: {
						tableName: 'clocks',
					},
					key: 'id',
				},
			},

			userId: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: {
						tableName: 'users',
					},
					key: 'id',
				},
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
			},

			masterId: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: {
						tableName: 'masters',
					},
					key: 'id',
				},
			},

			startWorkOn: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},

			endWorkOn: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},

			ratingIdentificator: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},

			orderRating: {
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
