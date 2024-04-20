const { DataTypes } = require("sequelize");
const {sequelize} = require("../database");
const Partenaire = require("./Partenaire"); // Import the Partenaire model

const Denree = sequelize.define("denrees", {
  ID_Denree: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_peremption: {
    type: DataTypes.DATE,
    allowNull: false
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ID_Stock: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_commercant: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "commercants_partenaire",
      key: "id_commercant"
    }
  },
  id_maraude: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "maraudes",
      key: "id_maraude"
    }
  }
}, {
  tableName: "denrees",
  timestamps: false
});

module.exports = Denree;
