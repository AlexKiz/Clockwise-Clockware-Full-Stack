'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('masters', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },

    name: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
    },

    rating: {
        type: Sequelize.DataTypes.REAL,
        allowNull: false,
        defaultValue: 0
    },

    rated_sum: {
        type: Sequelize.DataTypes.REAL,
        allowNull: false,
        defaultValue: 0
    },

    rated_quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('masters');
  }
};