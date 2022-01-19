/* eslint-disable require-jsdoc */
'use strict';
import {
	Model,
} from 'sequelize';
import {MasterCitiesAttributes} from './modelsConstants';

export default (sequelize: any, DataTypes: any) => {
	class MasterCities extends Model<MasterCitiesAttributes>
		implements MasterCitiesAttributes {
		public masterId!: string;
		public cityId!: number;
	}

	MasterCities.init(
		{
			masterId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			cityId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
		}, {
			sequelize,
			modelName: 'master_cities',
			tableName: 'master_cities',
			timestamps: false,
		});

	return MasterCities;
};
