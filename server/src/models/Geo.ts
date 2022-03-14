/* eslint-disable require-jsdoc */
'use strict';
import {
	Model,
	Optional,
} from 'sequelize';
import {GeoAttributes} from './modelsConstants';

type GeoCreationAttributes = Optional<GeoAttributes, 'id'>

export default (sequelize: any, DataTypes: any) => {
	class Geo extends Model<GeoAttributes, GeoCreationAttributes>
		implements GeoAttributes {
		public id!: number;
		public cityId!: number;
		public lat!: number;
		public lng!: number;

		static createCoordinatesById(cityId: number, coordinates: {lat: number, lng: number}[]) {
			this.destroy({where: {cityId}});

			const bulkList = coordinates.map((elem) => {
				return {
					cityId,
					lat: elem.lat,
					lng: elem.lng,
				};
			});

			return this.bulkCreate(bulkList);
		}
	}

	Geo.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			cityId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			lat: {
				type: DataTypes.DECIMAL,
				allowNull: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			lng: {
				type: DataTypes.DECIMAL,
				allowNull: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
		}, {
			sequelize,
			modelName: 'geo',
			tableName: 'geo',
			timestamps: false,
		});

	return Geo;
};
