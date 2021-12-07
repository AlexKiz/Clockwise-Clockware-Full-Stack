'use strict';
import {
    Model,
    Optional
} from 'sequelize';


interface CityAttributes {
    id: number,
    name: string
}

interface CityCreationAttributes extends Optional<CityAttributes, "id"> {}

export = (sequelize: any, DataTypes:any) => {
    class City extends Model<CityAttributes, CityCreationAttributes>
        implements CityAttributes {
        public id!: number 
        public name!: string

        static findById(entityId: number | number[]) {
            return this.findAll({where: {id: entityId}})
        }

        static updateById(entityId: number, {...options}) {
            return this.update({...options},{where: {id: entityId}})
        }

        static deleteById(entityId: number | number[]) {
            return this.destroy({where: {id: entityId}})
        }

        static associate(models: any) {
            City.belongsToMany(models.master, { 
                through: models.master_cities,
                foreignKey: 'cityId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
            City.hasMany(models.order, {
                foreignKey: 'cityId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
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
                onUpdate: 'CASCADE'
            },
        
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'city',
            tableName: "cities",
            timestamps: false
    });

    return City;
};