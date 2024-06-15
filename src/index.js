const express = require("express");
const cors = require("cors");
const {
  getAllOrders,
  createOrder,
  getOrderDetails,
} = require("./controllers/Orders");
const {
  getExpenses,
  getExpensesByProvider,
  addExpense,
} = require("./controllers/Expenses");
const app = express();

app.use(express.json());

const port = 3000;

// Configurar CORS para permitir cualquier conexión
app.use(cors());

// Ruta de ejemplo
app.get("/", async (req, res) => {
  const results = await getAllOrders();
  res.send({ results: results });
});

// Ruta de ejemplo
app.post("/orders/list", async (req, res) => {
  const results = await getAllOrders();
  res.send(results);
});

app.post("/orders/details", async (req, res) => {
  const orderId = req.body.orderId;
  const results = await getOrderDetails(orderId);
  res.send(results[0]);
});

app.post("/orders/create", async (req, res) => {
  try {
    const payload = req.body;

    if (!payload) {
      throw new Error("payload vacio");
    }

    console.log("payload", payload);

    const results = await createOrder(payload);

    res.send(results);
  } catch (error) {
    res.status(400).send({ message: "No se pudo crear el pedido" });
  }
});

/* EXPENSES */

app.post("/expenses/list", async (req, res) => {
  const range = req.body;

  const results = await getExpenses(range.fechaInicial, range.fechaFinal);
  res.send(results);
});

app.post("/expenses/byProvider", async (req, res) => {
  const range = req.body;

  const results = await getExpensesByProvider();
  res.send(results);
});

app.post("/expenses/add", async (req, res) => {
  try {
    const payload = req.body;

    console.log("payload", payload);

    if (!payload) {
      throw new Error("payload vacio");
    }
    const results = await addExpense(payload);
    console.log('results',results)
    res.send(results);
  } catch (error) {
    res.status(400).send({ message: "No fue posible agregar el gasto" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
