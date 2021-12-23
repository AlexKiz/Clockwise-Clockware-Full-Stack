/* eslint-disable require-jsdoc */
'use strict';
import {
	Model,
	Optional,
	UUIDV4,
} from 'sequelize';
import {OrderAttributes} from './modelsConstants';

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'orderRating'> {}

export = (sequelize: any, DataTypes: any) => {
	class Order extends Model<OrderAttributes, OrderCreationAttributes>
		implements OrderAttributes {
		public id!: string;
		public clockId!: number;
		public userId!: string;
		public cityId!: number;
		public masterId!: string;
		public startWorkOn!: string;
		public endWorkOn!: string;
		public ratingIdentificator!: string;
		public orderRating!: number;
		public isCompleted!: boolean;

		static findById(entityId: string | string[]) {
			return this.findAll({where: {id: entityId}});
		}

		static updateById(entityId: string, {...values}) {
			return this.update({...values}, {where: {id: entityId}});
		}

		static deleteById(entityId: string) {
			return this.destroy({where: {id: entityId}});
		}
		static associate(models: any) {
			Order.belongsTo(models.City, {
				foreignKey: 'cityId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
			Order.belongsTo(models.Clock, {
				foreignKey: 'clockId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
			Order.belongsTo(models.Master, {
				foreignKey: 'masterId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
			Order.belongsTo(models.User, {
				foreignKey: 'userId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
		}
	};

	Order.init(
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: UUIDV4,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			clockId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},

			userId: {
				type: DataTypes.UUID,
				allowNull: false,
			},

			cityId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},

			masterId: {
				type: DataTypes.UUID,
				allowNull: false,
			},

			startWorkOn: {
				type: DataTypes.DATE,
				allowNull: false,
			},

			endWorkOn: {
				type: DataTypes.DATE,
				allowNull: false,
			},

			ratingIdentificator: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			orderRating: {
				type: DataTypes.REAL,
				defaultValue: 0,
			},

			isCompleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		}, {
			sequelize,
			modelName: 'order',
			tableName: 'orders',
			timestamps: false,
		});

	return Order;
};
