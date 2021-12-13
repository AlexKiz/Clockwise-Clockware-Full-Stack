/* eslint-disable require-jsdoc */
'use strict';

import {
	Model,
	Optional,
} from 'sequelize';
import {ClockAttributes} from './modelsConstants';

interface ClockCreationAttributes extends Optional<ClockAttributes, 'id'| 'installationTime' > {}

export default (sequelize: any, DataTypes: any) => {
	class Clock extends Model<ClockAttributes, ClockCreationAttributes>
		implements ClockAttributes {
		public id!: number;
		public size!: string;
		public price!: number;
		public installationTime!: number;

		static findById(entityId: number) {
			return this.findAll({where: {id: entityId}});
		}

		static associate(models: any) {
			Clock.hasMany(models.Order, {
				foreignKey: 'clockId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
		}
	};
	Clock.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			size: {
				type: DataTypes.STRING(20),
				allowNull: false,
			},

			price: {
				type: DataTypes.INTEGER,
			},

			installationTime: {
				type: DataTypes.INTEGER,

			},
		}, {
			sequelize,
			modelName: 'clock',
			tableName: 'clocks',
			timestamps: false,
		});

	return Clock;
};
