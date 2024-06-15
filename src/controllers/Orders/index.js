const { sql, poolPromise } = require("../../database/connection");

async function getAllOrders() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("EXEC Ordenes.ListadoDeOrdenes");
    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
  }
}

async function getOrderDetails(orderId) {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("OrdenID", orderId);


    const result = await request.query("EXEC dbo.OrdenDetalle @OrdenID");
    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
  }
}

async function createOrder(payload) {
  const {
    nombreCliente,
    correo,
    telefono,
    direccion,
    nit,
    fechaOrden,
    fechaRecepcion,
    fechaEstimada,
    anticipo,
    productoId,
    cantidad,
    descripcion,
  } = payload;

  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Add input parameters to the request
    request.input("nombreCliente", nombreCliente);
    request.input("correo", correo);
    request.input("telefono", telefono);
    request.input("direccion", direccion);
    request.input("nit", nit);
    request.input("fechaOrden", fechaOrden);
    request.input("fechaRecepcion", fechaRecepcion);
    request.input("fechaEstimada", fechaEstimada);
    request.input("anticipo", anticipo);
    request.input("productoId", productoId);
    request.input("cantidad", cantidad);
    request.input("descripcion", descripcion);

    // Execute the stored procedure with parameters
    const result = await request.query(`
      EXEC Ordenes.GenerarOrden
      @nombreCliente,
      @correo,
      @telefono,
      @direccion,
      @nit,
      @fechaOrden,
      @fechaRecepcion,
      @fechaEstimada,
      @anticipo,
      @productoId,
      @cantidad,
      @descripcion
    `);

    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
  }
}

module.exports = {
  getAllOrders,
  createOrder,
  getOrderDetails
};
