/*
* SimpleKeys
* Database.js
* 30/jul/2022
*/

'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
      /*
        Add altering commands here.
        Return a promise to correctly handle asynchronicity.
  
        Example:
        return queryInterface.bulkInsert('Person', [{
          name: 'John Doe',
          isBetaMember: false
        }], {});
      */
  
        return queryInterface.bulkInsert("Entradas", [{
          nome: "Kauã",
          descricao: "Email Teste",
          usuario: "kaua@gmail.com",
          senha: "senhaExemploHasheada",
          site: "https://gmail.com",
          expira: "N;",
          grupoImg: "",
          grupoLista: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        }], {});
    },
  
    down: async (queryInterface, Sequelize) => {
      /*
        Add reverting commands here.
        Return a promise to correctly handle asynchronicity.
  
        Example:
        return queryInterface.bulkDelete('Person', null, {});
      */
  
        try {
          return queryInterface.bulkDelete("Usuarios", null, {});
        } catch (error) {
          console.log("Erro " + error + ". Tente novamente mais tarde...")
        }
      
    }
};