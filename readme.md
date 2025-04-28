<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>First Courier Service</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header>
    <h1>First Courier Service</h1>
    <p>Your fast, reliable delivery partner.</p>
  </header>

  <section>
    <h2>Request a Quote</h2>
    <form action="#" method="POST">
      <label>Pickup Address:</label><br />
      <input type="text" name="pickup" required /><br />
      <label>Drop-off Address:</label><br />
      <input type="text" name="dropoff" required /><br />
      <label>Package Weight (kg):</label><br />
      <input type="number" name="weight" step="0.1" required /><br />
      <button type="submit">Get Quote</button>
    </form>
  </section>

  <section>
    <h2>Track Your Parcel</h2>
    <form action="#" method="GET">
      <label>Tracking ID:</label><br />
      <input type="text" name="tracking_id" required /><br />
      <button type="submit">Track</button>
    </form>
  </section>

  <footer>
    <p>&copy; 2025 First Courier Service</p>
  </footer>
</body>
</html>
"""

style_css = """
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  color: #333;
}
header {
  background: #003366;
  color: white;
  padding: 20px;
  text-align: center;
}
section {
  padding: 20px;
  margin: 20px;
  background: white;
  border-radius: 10px;
}
form input, form button {
  padding: 10px;
  margin: 5px 0;
  width: 100%;
  max-width: 400px;
}
button {
  background: #003366;
  color: white;
  border: none;
  cursor: pointer;
}
footer {
  text-align: center;
  padding: 10px;
  background: #eee;
}
"""

# Backend files (server.js, routes, models)
server_js = """
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use(cors());
app.use(bodyParser.json());
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => res.send('Courier backend running'));
app.listen(process.env.PORT, () => console.log("Server on port " + process.env.PORT));
"""

order_routes_js = """
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/create', async (req, res) => {
  const { pickup, dropoff, weight } = req.body;
  const trackingId = 'TRK' + Math.random().toString(36).substr(2, 8).toUpperCase();
  const order = new Order({ pickup, dropoff, weight, trackingId });
  await order.save();
  res.json({ message: "Order created", trackingId });
});

// Track a parcel
router.get('/track/:id', async (req, res) => {
  const order = await Order.findOne({ trackingId: req.params.id });
  if (!order) return res.status(404).json({ message: "Not found" });
  res.json(order);
});

module.exports = router;
"""

order_model_js = """
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  pickup: String,
  dropoff: String,
  weight: Number,
  trackingId: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});