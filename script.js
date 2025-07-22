const BACKEND_URL = "https://iship-backend.onrender.com";

// Keyboard shortcut: Ctrl+Shift+A opens hidden admin login
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
    const password = prompt("Enter Admin Password:");
    if (password === "DAKOTA14!") {
      document.getElementById("adminContainer").style.display = "block";
    } else {
      alert("Incorrect password");
    }
  }
});

// Quote request
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
  } catch {
    alert("Failed to get quote. Try again.");
  }
});

// Track package
document.getElementById("trackForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const trackingId = document.getElementById("trackInput").value.trim();

  try {
    const res = await fetch(`${BACKEND_URL}/api/track/${trackingId}`);
    if (!res.ok) throw new Error("Invalid ID");
    const data = await res.json();

    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Tracking Info</title></head>
      <body style="font-family:sans-serif;padding:2rem;background:#f4f6f8">
        <h2>Tracking Details</h2>
        <p><strong>Pickup:</strong> ${data.pickup}</p>
        <p><strong>Drop-off:</strong> ${data.dropoff}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Last Updated:</strong> ${new Date(data.lastUpdated).toLocaleString()}</p>
      </body></html>
    `);
  } catch {
    alert("Invalid Tracking ID");
  }
});

// Admin - Create tracking
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
  } catch {
    alert("Failed to create tracking.");
  }
});

// Admin - Update tracking
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
  } catch {
    alert("Failed to update status.");
  }
});
