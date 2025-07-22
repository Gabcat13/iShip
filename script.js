function trackShipment() {
  const input = document.getElementById('trackingInput');
  const trackingId = input.value.trim();

  if (!trackingId) {
    alert('Please enter a tracking ID');
    return;
  }

  fetch(`https://iship-backend.onrender.com/api/track/${trackingId}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert('❌ Invalid Tracking ID');
      } else {
        const resultBox = document.getElementById('trackingResult');
        resultBox.innerHTML = `
          <p><strong>Pickup:</strong> ${data.pickup}</p>
          <p><strong>Dropoff:</strong> ${data.dropoff}</p>
          <p><strong>Weight:</strong> ${data.weight} kg</p>
          <p><strong>Status:</strong> ${data.status}</p>
          <p><strong>Last Updated:</strong> ${new Date(data.lastUpdated).toLocaleString()}</p>
        `;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Failed to fetch tracking info');
    });
}
