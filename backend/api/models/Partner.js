const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
const Lieux = require("./Lieux"); // Import the Lieux model

const Partner = sequelize.define("commercants_partenaire", {
    id_commercant: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact: {
        type: DataTypes.STRING
    },
    id_adresse: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    // Disable createdAt and updatedAt fields
    timestamps: false
});

// Define association with Lieux model
Partner.belongsTo(Lieux, {
  foreignKey: 'id_adresse', // Specify the foreign key in the Partner table
  targetKey: 'id_lieu', // Specify the target key in the Lieux table
  as: 'lieues' // Alias for the Lieux table
});

module.exports = Partner;
