/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

import { Database } from 'sqlite3';

const knex = require('knex')({
    client: 'sqlite3',
    connection: () => ({
        filename: process.env.SQLITE_FILENAME
    })
});

export default Database;