# Create directories for the backend and frontend
os.makedirs("courier-service/frontend", exist_ok=True)
os.makedirs("courier-service/backend/models", exist_ok=True)
os.makedirs("courier-service/backend/routes", exist_ok=True)

# Frontend files (index.html and style.css)
index_html = """
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

module.exports = mongoose.model('Order', orderSchema);
"""

# .env file
env_content = """
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.mongodb.net/courierdb
PORT=5000
"""

# Create all files
with open("courier-service/frontend/index.html", "w") as f:
    f.write(index_html)
with open("courier-service/frontend/style.css", "w") as f:
    f.write(style_css)

with open("courier-service/backend/server.js", "w") as f:
    f.write(server_js)

with open("courier-service/backend/routes/orderRoutes.js", "w") as f:
    f.write(order_routes_js)

with open("courier-service/backend/models/Order.js", "w") as f:
    f.write(order_model_js)

with open("courier-service/backend/.env", "w") as f:
    f.write(env_content)

# Create a README file for deployment instructions
readme_content = """
# Courier Service Website

This is a simple courier service website with a backend built with Node.js, Express, and MongoDB.

### Frontend
- The frontend consists of a homepage, a quote request form, and a parcel tracking form.

### Backend
- The backend uses Node.js with Express and MongoDB to handle order creation and tracking.
- Two main endpoints are available:
  - **POST /api/orders/create** to create a new order and get a tracking ID.
  - **GET /api/orders/track/:id** to track an order using the tracking ID.

### Deployment Instructions
1. Push the code to a GitHub repository.
2. Use [Render](https://render.com) for deployment.
   - Create a new web service.
   - Set up environment variables in Render with your MongoDB URI and PORT.

3. Frontend deployment can be done with [Netlify](https://www.netlify.com) by uploading the `/frontend` folder.

### MongoDB
- You can use [MongoDB Atlas](https://cloud.mongodb.com) for a cloud-hosted database.
"""

# Write README
with open("courier-service/README.md", "w") as f:
    f.write(readme_content)

# Create the zip file
zip_filename = "courier-service.zip"
with zipfile.ZipFile(zip_filename, 'w') as zipf:
    # Frontend files
    zipf.write("courier-service/frontend/index.html", arcname="frontend/index.html")
    zipf.write("courier-service/frontend/style.css", arcname="frontend/style.css")
    
    # Backend files
    zipf.write("courier-service/backend/server.js", arcname="backend/server.js")
    zipf.write("courier-service/backend/routes/orderRoutes.js", arcname="backend/routes/orderRoutes.js")
    zipf.write("courier-service/backend/models/Order.js", arcname="backend/models/Order.js")
    zipf.write("courier-service/backend/.env", arcname="backend/.env")
    
    # README
    zipf.write("courier-service/README.md", arcname="README.md")
