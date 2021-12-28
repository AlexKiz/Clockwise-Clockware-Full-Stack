/* eslint-disable require-jsdoc */
'use strict';
import {
	Model,
} from 'sequelize';
import {AdminAttributes} from './modelsConstants';

export default (sequelize: any, DataTypes: any) => {
	class Admin extends Model<AdminAttributes>
		implements AdminAttributes {
		public id!: number;
		public email!: string;
		public password!: string;

		static associate(models:any) {}
	}

	Admin.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		}, {
			sequelize,
			modelName: 'admin',
			tableName: 'admin',
			timestamps: false,
		});

	return Admin;
};
