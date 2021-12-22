/* eslint-disable require-jsdoc */
'use strict';
import {
	Model,
	Optional,
	UUIDV4,
} from 'sequelize';
import {UserAttributes} from './modelsConstants';

interface UserCreationAttributes extends Optional<UserAttributes, 'id'| 'password'> {}

export default (sequelize: any, DataTypes: any) => {
	class User extends Model<UserAttributes, UserCreationAttributes>
		implements UserAttributes {
		public id!: string;
		public name!: string;
		public password!: string;
		public email!: string;
		public role!: string;
		public hashVerify!: string;
		public isVerified!: boolean;


		static findById(entityId: string) {
			return this.findAll({where: {id: entityId}});
		}

		static updateById(entityId: string, {...values}) {
			return this.update({...values}, {where: {id: entityId}});
		}

		static deleteById(entityId: string) {
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

			password: {
				type: DataTypes.STRING(100),
				allowNull: true,
			},

			email: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true,
			},

			role: {
				type: DataTypes.STRING(30),
				allowNull: false,
			},

			hashVerify: {
				type: DataTypes.STRING(150),
				allowNull: true,
			},

			isVerified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
		}, {
			sequelize,
			modelName: 'user',
			tableName: 'users',
			timestamps: false,
		});

	return User;
};
