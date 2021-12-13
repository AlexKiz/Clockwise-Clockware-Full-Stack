'use strict';
import {
    Model,
    Optional
} from 'sequelize';

interface MasterAttributes {
    id: number,
    name: string,
    rating: number, 
    ratedSum: number,
    ratedQuantity: number,
}

interface MasterCreationAttributes extends Optional<MasterAttributes, "id" | "rating" | "ratedSum" | "ratedQuantity"> {}

export default (sequelize: any, DataTypes: any) => {
    class Master extends Model<MasterAttributes, MasterCreationAttributes>
        implements MasterAttributes {
        public id!: number 
        public name!: string
        public rating!: number
        public ratedSum!: number
        public ratedQuantity!: number

        static findById(entityId: number) {
            return this.findAll({where: {id: entityId}})
        }

        static updateById(entityId: number, {...values}, {...options}) {
            return this.update({...values},{where: {id: entityId}, ...options})
        }

        static deleteById(entityId: number) {
            return this.destroy({where:{id: entityId}})
        }
        static associate(models: any) {
            Master.belongsToMany(models.City, { 
                through: models.MasterCities,
                foreignKey: 'masterId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
            Master.hasMany(models.Order, {
                foreignKey: 'masterId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        }
    };
    
    Master.init(
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
            },
        
            rating: {
                type: DataTypes.REAL,
                allowNull: false,
                defaultValue: 0
            },
        
            ratedSum: {
                type: DataTypes.REAL,
                allowNull: false,
                defaultValue: 0
            },
        
            ratedQuantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }, {
            sequelize,
            modelName: 'master',
            tableName: "masters",
            timestamps: false
    });

    return Master;
};