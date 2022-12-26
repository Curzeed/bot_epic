const {host, user, password, database, port} = require('./config.json');
const mysql = require('mysql');
var pool;
module.exports = {
    getPool: function () {
      if (pool) return pool;
      pool = mysql.createPool({
        host : host,
        user : user,
        password : password,
        port : port,
        database : database,
      });
      return pool;
    }
};