import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Project extends Model {}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'active',
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
  },
  {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default Project;
