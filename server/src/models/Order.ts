'use strict';
import {
    Model,
    Optional
} from 'sequelize';
import db from './index'

interface OrderAttributes {
    id: number,
    clockId: number,
    userId: number,
    cityId: number,
    masterId: number,
    startWorkOn: string,
    endWorkOn: string,
    ratingIdentificator: string,
    orderRating: number
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id" | "orderRating"> {}

export = (sequelize: any, DataTypes: any) => {
    class Order extends Model<OrderAttributes, OrderCreationAttributes>
        implements OrderAttributes {
            public id!: number
            public clockId!: number
            public userId!: number
            public cityId!: number
            public masterId!: number
            public startWorkOn!: string
            public endWorkOn!: string
            public ratingIdentificator!: string
            public orderRating!: number

            static findById(entityId: number | number[]) {
                return this.findAll({where: {id: entityId}})
            }

            static updateById(entityId: number, {...options}) {
                return this.update({...options},{where: {id: entityId}})
            } 

            static deleteById(entityId: number) {
                return this.destroy({where:{id: entityId}})
            }
        static associate(models: any) {
            Order.belongsTo(models.city, {
                foreignKey: 'cityId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
            Order.belongsTo(models.clock, {
                foreignKey: 'clockId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
            Order.belongsTo(models.master, {
                foreignKey: 'masterId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
            Order.belongsTo(models.user, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        }
    };

    Order.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
        
            clockId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        
            cityId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        
            masterId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        
            startWorkOn: {
                type: DataTypes.DATE,
                allowNull: false
            },
        
            endWorkOn: {
                type: DataTypes.DATE,
                allowNull: false
            },
        
            ratingIdentificator: {
                type: DataTypes.STRING,
                allowNull: false
            },
        
            orderRating: {
                type: DataTypes.REAL,
                defaultValue: 0
            }
        }, {
            sequelize,
            modelName: 'order',
            tableName: "orders",
            timestamps: false
    });

    return Order;
};