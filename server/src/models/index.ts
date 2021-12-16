'use strict';

require('dotenv').config()
const Sequelize = require('sequelize');
import Admin from './Admin'
import City from './City'
import Clock from './Clock'
import Master from './Master'
import MasterCities from './MasterCities'
import Order from './Order'
import User from './User'
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

let sequelize = new Sequelize(`${config.database}`, `${config.username}`, `${config.password}`, {...config});

  const db: any = {
    sequelize,
    Sequelize,
    Admin: Admin(sequelize, Sequelize.DataTypes),
    City: City(sequelize, Sequelize.DataTypes),
    Clock: Clock(sequelize, Sequelize.DataTypes),
    Master: Master(sequelize, Sequelize.DataTypes),
    MasterCities: MasterCities(sequelize, Sequelize.DataTypes),
    Order: Order(sequelize, Sequelize.DataTypes),
    User: User(sequelize, Sequelize.DataTypes),
  };

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
