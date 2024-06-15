const { sql, poolPromise } = require("../../database/connection");

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function getExpenses(fechaInicial, fechaFinal) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Add input parameters to the request
    request.input("inicio", fechaInicial);
    request.input("final", fechaFinal);

    const result = await request.query(`
        EXEC Ordenes.OrdenesGastos
        @inicio,
        @final
      `);

    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
  }
}

async function getExpensesByProvider() {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    const result = await request.query(`
          EXEC Proveedores.ObtenerReporteGastosProveedor`);

    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
  }
}

async function addExpense(payload) {
  const { monto, fechaGasto, providerId, tipoGasto, orderId } = payload;

  try {
    const pool = await poolPromise;
    const request = pool.request();

    const fechaGastoObj = new Date(fechaGasto);
    const fechaGastoFormatted = formatDateTime(fechaGastoObj);

    // Add input parameters to the request
    request.input("Monto", +monto);
    request.input("FechaGasto", fechaGasto);
    request.input("ProveedorID", +providerId);
    request.input("TipoGastoID", +tipoGasto);
    request.input("OrderID", +orderId);

    // Execute the stored procedure with parameters
    const result = await request.query(`
      EXEC NuevoGasto
      @FechaGasto,
      @ProveedorID,
      @Monto,
      @OrderID,
      @TipoGastoID
    `);

    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
  }
}

module.exports = {
  getExpenses,
  getExpensesByProvider,
  addExpense,
};
