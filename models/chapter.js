'use strict'

module.exports = (sequelize, DataTypes) => {
  var Chapter = sequelize.define('Chapter', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    order: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  })
  return Chapter
}
