document.addEventListener("DOMContentLoaded", function () {
  const BACKEND_URL = "https://iship-backend.onrender.com";

  const loginBtn = document.getElementById('loginBtn');
  const adminContainer = document.getElementById('adminContainer');
  const loginSection = document.getElementById('loginSection');

  loginBtn.addEventListener('click', () => {
    const password = prompt("Enter Admin Password:");
    if(password === "DAKOTA14!") {
      adminContainer.style.display = 'block';
      loginSection.style.display = 'none';
    } else {
      alert("Incorrect password");
    }
  });

  // Quote request submission
  document.getElementById("quoteForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const pickup = document.getElementById("pickup").value.trim();
    const dropoff = document.getElementById("dropoff").value.trim();
    const weight = parseFloat(document.getElementById("weight").value);

    try {
      const res = await fetch(`${BACKEND_URL}/api/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, dropoff, weight })
      });

      const data = await res.json();
      alert(`Quote price: $${data.price.toFixed(2)}`);
    } catch (err) {
      alert("Failed to get quote. Try again.");
    }
  });

  // Create tracking (admin)
  document.getElementById("createForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const pickup = document.getElementById("adminPickup").value.trim();
    const dropoff = document.getElementById("adminDropoff").value.trim();
    const weight = parseFloat(document.getElementById("adminWeight").value);

    try {
      const res = await fetch(`${BACKEND_URL}/api/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, dropoff, weight })
      });

      const data = await res.json();
      alert(`Tracking ID created: ${data.trackingId}`);
    } catch (err) {
      alert("Failed to create tracking. Try again.");
    }
  });
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const adminCode = params.get('admin');

  if (adminCode === 'access123') {
    document.getElementById("adminTrackingSection").style.display = "block";
  }
});

// Admin tracking creation form logic
document.getElementById("createForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const pickup = document.getElementById("pickup").value.trim();
  const dropoff = document.getElementById("dropoff").value.trim();
  const weight = parseFloat(document.getElementById("weight").value);

  try {
    const res = await fetch("https://iship-backend.onrender.com/api/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pickup, dropoff, weight })
    });

    const data = await res.json();
    document.getElementById("trackingResult").textContent = `Tracking ID: ${data.trackingId}`;
  } catch (err) {
    alert("Failed to create tracking.");
  }
});

  // Update status (admin)
  document.getElementById("updateForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const trackingId = document.getElementById("trackingId").value.trim();
    const status = document.getElementById("status").value.trim();

    try {
      const res = await fetch(`${BACKEND_URL}/api/update/${trackingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      alert(data.message || "Status updated.");
    } catch (err) {
      alert("Failed to update status. Try again.");
    }
  });

  // Track package
  document.getElementById("trackForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const trackingId = document.getElementById("trackInput").value.trim();

    try {
      const res = await fetch(`${BACKEND_URL}/api/track/${trackingId}`);
      if (!res.ok) throw new Error("Tracking ID not found");
      const data = await res.json();

      const detailWindow = window.open("", "_blank");
      detailWindow.document.write(\`
        <html>
          <head>
            <title>Tracking Details</title>
            <style>
              body {
                font-family: 'Roboto', sans-serif;
                background: #f4f6f8;
                padding: 40px;
                text-align: center;
              }
              .box {
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                max-width: 500px;
                margin: auto;
                text-align: left;
              }
              h2 {
                color: #002B5B;
              }
              p {
                font-size: 1.1em;
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="box">
              <h2>Tracking Details</h2>
              <p><strong>Recipient Name:</strong> \${data.pickup}</p>
              <p><strong>Delivery Address:</strong> \${data.dropoff}</p>
              <p><strong>Status:</strong> \${data.status}</p>
              <p><strong>Last Updated:</strong> \${new Date(data.lastUpdated).toLocaleString()}</p>
            </div>
          </body>
        </html>
      \`);
    } catch (err) {
      alert("Invalid Tracking ID");
    }
  });
});
