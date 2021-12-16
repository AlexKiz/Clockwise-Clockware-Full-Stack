'use strict';
import {
  Model
} from 'sequelize';
import db from './index'

interface MasterCitiesAttributes {
  masterId: number,
  cityId: number
}



export default (sequelize: any, DataTypes: any) => {

  class MasterCities extends Model<MasterCitiesAttributes>
      implements MasterCitiesAttributes {
      public masterId!: number
      public cityId!: number

      static associate(models: any) {}
    };

    MasterCities.init(
      {
          masterId: {
              type: DataTypes.INTEGER,
              allowNull: false,
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE' 
          },
        
          cityId: {
              type: DataTypes.INTEGER,
              allowNull: false,
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE'
          }
      }, {
          sequelize,
          modelName: 'master_cities',
          tableName: 'master_cities',
          timestamps: false,
  });

    return MasterCities;
};