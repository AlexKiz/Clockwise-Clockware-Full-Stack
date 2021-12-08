/* eslint-disable require-jsdoc */
'use strict';
import {
	Model,
	Optional,
} from 'sequelize';
import {UserAttributes} from './modelsConstants';

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export default (sequelize: any, DataTypes: any) => {
	class User extends Model<UserAttributes, UserCreationAttributes>
		implements UserAttributes {
		public id!: number;
		public name!: string;
		public email!: string;

		static findById(entityId: number) {
			return this.findAll({where: {id: entityId}});
		}

		static updateById(entityId: number, {...options}) {
			return this.update({...options}, {where: {id: entityId}});
		}

		static deleteById(entityId: number) {
			return this.destroy({where: {id: entityId}});
		}

		static associate(models: any) {
			User.hasMany(models.Order, {
				foreignKey: 'userId',
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			});
		}
	};

	User.init(
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

			email: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true,
			},
		}, {
			sequelize,
			modelName: 'user',
			tableName: 'users',
			timestamps: false,
		});

	return User;
};
