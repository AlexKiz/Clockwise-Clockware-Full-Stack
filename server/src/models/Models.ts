import { AdminModel, CityModel, ClockModel, MasterCitiesModel, MasterModel, OrderModel, UserModel } from './modelConstants';
import { DataTypes } from 'sequelize'
import { db1 } from '../db'


const Admin = db1.define<AdminModel>('Admin', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    }, 

    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'admin',
    timestamps: false
})

const City = db1.define<CityModel>('city', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    timestamps: false
})

const Clock = db1.define<ClockModel>('clock', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
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
    timestamps: false
})

const Master = db1.define<MasterModel>('master', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
    timestamps: false
})

const Master_Cities = db1.define<MasterCitiesModel>('Master_Cities', {
    master_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Master,
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
    }
}, {
    timestamps: false,
    tableName: 'master_cities'
})

const User = db1.define<UserModel>('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
    timestamps: false
})

const Order = db1.define<OrderModel>('Order', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
    timestamps: false
})


Master.belongsToMany(City, { 
    through: Master_Cities,
    foreignKey: 'master_id'
})
City.belongsToMany(Master, { 
    through: Master_Cities,
    foreignKey: 'city_id'
})


User.hasMany(Order, {
    foreignKey: 'user_id',
})
Order.belongsTo(User, {
    foreignKey: 'user_id'
})


Clock.hasMany(Order, {
    foreignKey: 'clock_id'
})
Order.belongsTo(Clock, {
    foreignKey: 'clock_id'
})


City.hasMany(Order, {
    foreignKey: 'city_id'
})
Order.belongsTo(City, {
    foreignKey: 'city_id'
})


Master.hasMany(Order, {
    foreignKey: 'master_id',
})
Order.belongsTo(Master, {
    foreignKey: 'master_id'
})