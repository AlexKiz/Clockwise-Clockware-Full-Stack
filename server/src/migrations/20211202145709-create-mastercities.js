'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('master_cities', {
      master_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Master,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE' 
    },

    city_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: City,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_cities');
  }
};