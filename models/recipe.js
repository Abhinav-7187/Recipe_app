const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category');

const Recipe = sequelize.define('Recipe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Establish relationship
Recipe.belongsTo(Category);
Category.hasMany(Recipe);

module.exports = Recipe;