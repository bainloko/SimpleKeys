/*
* SimpleKeys
* seed.js
* 12/set/2022
*/

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Entradas', [
      {
        nome: 'Google',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        descricao: 'Exemplo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        site: 'https://google.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        login: 'fulanodetal@gmail',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        senha: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        expira: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Entradas', null, {});
  }
};
