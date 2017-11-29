'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Chapters',
      'content',
      {
        type: Sequelize.TEXT,
        allowNull: true
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Chapters',
      'content',
      {
        type: Sequelize.STRING
      }
    )
  }
}
