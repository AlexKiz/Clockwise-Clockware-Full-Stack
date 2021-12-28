/* eslint-disable require-jsdoc */
'use strict';
import {
	Model,
	Optional,
} from 'sequelize';
import {CityAttributes} from './modelsConstants';

interface CityCreationAttributes extends Optional<CityAttributes, 'id'> {}

export default (sequelize: any, DataTypes:any) => {
	class City extends Model<CityAttributes, CityCreationAttributes>
		implements CityAttributes {
		public id!: number;
		public name!: string;

		static findById(entityId: number | number[]) {
			return this.findAll({where: {id: entityId}});
		}

		static updateById(entityId: number, {...options}) {
			return this.update({...options}, {where: {id: entityId}});
		}

		static deleteById(entityId: number | number[]) {
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
	};

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
