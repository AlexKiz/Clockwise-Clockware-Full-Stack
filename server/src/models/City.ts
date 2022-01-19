/* eslint-disable require-jsdoc */
'use strict';
import {
	Model,
	Optional,
} from 'sequelize';
import {CityAttributes} from './modelsConstants';

type CityCreationAttributes = Optional<CityAttributes, 'id'>

export default (sequelize: any, DataTypes: any) => {
	class City extends Model<CityAttributes, CityCreationAttributes>
		implements CityAttributes {
		public id!: number;
		public name!: string;

		static findById(entityId: number) {
			return this.findAll({where: {id: entityId}});
		}

		static updateById(entityId: number, {...values}) {
			return this.update({...values}, {where: {id: entityId}});
		}

		static deleteById(entityId: number) {
			return this.destroy({where: {id: entityId}});
		}

		static associate(models: any) {
			City.belongsToMany(models.Master, {
				through: models.MasterCities,
				foreignKey: 'cityId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
			City.hasMany(models.Order, {
				foreignKey: 'cityId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
		}
	}

	City.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			name: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
		}, {
			sequelize,
			modelName: 'city',
			tableName: 'cities',
			timestamps: false,
		});

	return City;
};
