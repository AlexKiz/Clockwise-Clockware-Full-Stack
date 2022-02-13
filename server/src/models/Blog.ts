/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable require-jsdoc */
'use strict';
import {
	Model,
	Optional,
} from 'sequelize';
import {BlogAttributes} from './modelsConstants';

type BlogCreationAttributes = Optional<BlogAttributes, 'id'>

export default (sequelize: any, DataTypes: any) => {
	class Blog extends Model<BlogAttributes, BlogCreationAttributes>
		implements BlogAttributes {
		public id!: string;
		public title!: string;
		public background!: string;
		public description!: string;
		public body!: string;

		static updateById(entityId: number, {...values}) {
			return this.update({...values}, {where: {id: entityId}});
		}

		static deleteById(entityId: number) {
			return this.destroy({where: {id: entityId}});
		}

		static associate(models: any) {}
	}

	Blog.init(
		{
			id: {
				type: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},

			title: {
				type: DataTypes.STRING(75),
				allowNull: false,
			},

			background: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			description: {
				type: DataTypes.STRING(170),
				allowNull: false,
			},

			body: {
				type: DataTypes.STRING(3350),
				allowNull: false,
			},
		}, {
			sequelize,
			modelName: 'blog',
			tableName: 'blog',
			timestamps: true,
		});

	return Blog;
};
