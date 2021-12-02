import { 
    Model, 
    DataTypes, 
    Association, 
    Optional, 
    BelongsToManySetAssociationsMixin
} from "sequelize";
import sequelize from '../db'
import {
    CityAttributes,
    ClockAttributes,
    MasterAttributes,
    OrderAttributes,
    UserAttributes,
    AdminAttributes,
    MasterCitiesAttributes
} from './modelConstant'

interface CityCreationAttributes extends Optional<CityAttributes, "id"> {}

interface ClockCreationAttributes extends Optional<ClockAttributes, "id"| "installation_time" > {}

interface MasterCreationAttributes extends Optional<MasterAttributes, "id" | "rating" | "rated_sum" | "rated_quantity"> {}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id" | "order_rating"> {}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}



export class Admin extends Model<AdminAttributes>
    implements AdminAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
}


export class Clock extends Model<ClockAttributes, ClockCreationAttributes>
    implements ClockAttributes {
    public id!: number
    public size!: string
    public price!: number
    public installation_time!: number

    public static associations: {
        orders: Association<Clock, Order>

    }
}


export class City extends Model<CityAttributes, CityCreationAttributes>
    implements CityAttributes {
    public id!: number 
    public name!: string

    public static associations: {

    };
}


export class Master extends Model<MasterAttributes, MasterCreationAttributes>
    implements MasterAttributes {
    public id!: number 
    public name!: string
    public rating!: number
    public rated_sum!: number
    public rated_quantity!: number

    public setCities!: BelongsToManySetAssociationsMixin<City, 'id'>

    public static associations: {
        cities: Association<Master, City>
    };
}


export class MasterCities extends Model<MasterCitiesAttributes>
    implements MasterCitiesAttributes {
    public master_id!: number
    public city_id!: number

    public static associations: {
        cities: Association<MasterCities, City>
    }
}


export class Order extends Model<OrderAttributes, OrderCreationAttributes>
    implements OrderAttributes {
        public id!: number
        public clock_id!: number
        public user_id!: number
        public city_id!: number
        public master_id!: number
        public start_work_on!: string
        public end_work_on!: string
        public rating_identificator!: string
        public order_rating!: number

        public readonly clock?: Clock
        public readonly user?: User
        public readonly city?: City
        public readonly master?: Master

        public static associations: {
            clock: Association<Order, Clock>
            user: Association<Order, User>
            city: Association<Order, City>
            master: Association<Order, Master>
        }
}


export class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
}


Admin.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        }, 

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'admin',
        tableName: "admin",
        timestamps: false,
})


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
})


Clock.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
    
        size: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
    
        price: {
            type: DataTypes.INTEGER
        },
    
        installation_time: {
            type: DataTypes.INTEGER,
    
        }
    }, {
        sequelize,
        modelName: 'clock',
        tableName: "clocks",
        timestamps: false,
})


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
    
        rated_sum: {
            type: DataTypes.REAL,
            allowNull: false,
            defaultValue: 0
        },
    
        rated_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'master',
        tableName: "masters",
        timestamps: false
})


MasterCities.init(
    {
        master_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Master,
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE' 
        },
    
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: City,
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }, {
        sequelize,
        modelName: 'master_cities',
        tableName: 'master_cities',
        timestamps: false,
})

User.init(
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
            allowNull: false,
        },
    
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'user',
        tableName: 'users',
        timestamps: false
})

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
    
        clock_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Clock,
                key: 'id'
            }
        },
    
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
    
        city_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: City,
                key: 'id'
            }
        },
    
        master_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Master,
                key: 'id'
            }
        },
    
        start_work_on: {
            type: DataTypes.DATE,
            allowNull: false
        },
    
        end_work_on: {
            type: DataTypes.DATE,
            allowNull: false
        },
    
        rating_identificator: {
            type: DataTypes.STRING,
            allowNull: false
        },
    
        order_rating: {
            type: DataTypes.REAL,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'order',
        tableName: "orders",
        timestamps: false
})


City.belongsToMany(Master, { 
    through: MasterCities,
    foreignKey: 'city_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

City.hasMany(Order, {
    foreignKey: 'city_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


Order.belongsTo(City, {
    foreignKey: 'city_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Order.belongsTo(Clock, {
    foreignKey: 'clock_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Order.belongsTo(Master, {
    foreignKey: 'master_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Order.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


Master.belongsToMany(City, { 
    through: MasterCities,
    foreignKey: 'master_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Master.hasMany(Order, {
    foreignKey: 'master_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


User.hasMany(Order, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})


Clock.hasMany(Order, {
    foreignKey: 'clock_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})



