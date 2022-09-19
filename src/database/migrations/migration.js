/*
* SimpleKeys
* migration.js
* 12/set/2022
*/

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Entradas', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nome: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        descricao: {
            type: Sequelize.TEXT,
        },
        site: { 
            type: Sequelize.TEXT,
        },
        login: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        senha: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        expira: {
            type: Sequelize.INTEGER,
        },
        // grupoImg: Sequelize.BLOB,
        // grupoLista: Sequelize.TEXT
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Entradas');
  }
};
