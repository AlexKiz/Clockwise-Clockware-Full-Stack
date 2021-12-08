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

let sequelize = new Sequelize(`${process.env.DB_DATABASE}`, `${process.env.DB_USER}`, `${process.env.DB_PASSWORD}`, {
  host: `${process.env.DB_HOST}`,
  dialect: 'postgres',
});

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
