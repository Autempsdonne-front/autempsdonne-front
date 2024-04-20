const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Lieu = require('./Lieu');

const Partenaire = sequelize.define('commercants_partenaire', {
    ID_Commercant: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    nom: { type: Sequelize.STRING(100), allowNull: false },
    email: { type: Sequelize.STRING(100), allowNull: false },
    telephone: { type: Sequelize.STRING(10) },
    id_Adresse: { type: Sequelize.INTEGER }
}, {
    tableName: 'commercants_partenaire', 
    timestamps: false
  });

  module.exports = Partenaire;