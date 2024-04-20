const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Lieu = sequelize.define('Lieu', {
  id_lieu: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ville: {
    type: DataTypes.STRING
  },
  code_postal: {
    type: DataTypes.STRING(5)
  }
}, {
  tableName: 'lieux',
  timestamps: false
});

module.exports = Lieu;
