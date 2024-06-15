const sql = require("mssql");
require("dotenv").config();

const connectionConfig = {
  port: 1433,
  server: process.env.host || "",
  user: process.env.dbuser || "",
  password: process.env.PASSWORD || "",
  database: process.env.DATABASE || "",
  options: {
    encrypt: true, // Usa encriptación
    trustServerCertificate: true // Cambia a true para desarrollo local / certificados autofirmados
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 100000
  }
};


const poolPromise = new sql.ConnectionPool(connectionConfig)
  .connect()
  .then(pool => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch(err => {
    console.error("Database Connection Failed! Bad Config: ", err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};