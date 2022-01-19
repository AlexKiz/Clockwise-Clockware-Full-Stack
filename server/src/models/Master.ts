/* eslint-disable require-jsdoc */
'use strict';
import {
	Model,
	Optional,
	UUIDV4,
} from 'sequelize';
import {MasterAttributes} from './modelsConstants';

type MasterCreationAttributes = Optional<MasterAttributes, 'id' | 'rating'>

export default (sequelize: any, DataTypes: any) => {
	class Master extends Model<MasterAttributes, MasterCreationAttributes>
		implements MasterAttributes {
		public id!: string;
		public name!: string;
		public rating!: number;

		static findById(entityId: string) {
			return this.findAll({where: {id: entityId}});
		}

		static updateById(entityId: string, {...values}, {...options}) {
			return this.update({...values}, {where: {id: entityId}, ...options});
		}

		static deleteById(entityId: string) {
			return this.destroy({where: {id: entityId}});
		}

		static associate(models: any) {
			Master.belongsToMany(models.City, {
				through: models.MasterCities,
				foreignKey: 'masterId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
			Master.hasMany(models.Order, {
				foreignKey: 'masterId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
			Master.hasMany(models.User, {
				foreignKey: 'masterId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
		}
	}

	Master.init(
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				defaultValue: UUIDV4,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			name: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},

			rating: {
				type: DataTypes.REAL,
				allowNull: false,
				defaultValue: 0,
			},
		}, {
			sequelize,
			modelName: 'master',
			tableName: 'masters',
			timestamps: false,
		});

	return Master;
};
