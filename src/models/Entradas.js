/*
* SimpleKeys
* Entradas.js
* 22/jun/2022
* modelo principal, criar outro arquivo//definição para a leitura e gerenciamento básico do programa + gerenciamento avançado e configurações 
*/

import { Model, DataTypes } from "sequelize";

class Entrada extends Model {
    static init(sequelize){
        super.init({
            //o id não aparece aqui, pois é autoincremento. o mesmo vale pra outros valores automáticos
            nome: DataTypes.STRING,
            usuario: DataTypes.STRING,
            senha: DataTypes.STRING,
            site: DataTypes.STRING,
            descricao: DataTypes.STRING,
        }, { sequelize, freezeTableName: true }
        );
    }
}

export default Entrada;