const express = require('express');// Web framework for building APIs
const bodyParser = require('body-parser'); // Parses incoming request bodies
const WebSocket = require('ws');// WebSocket server for real-time communication

const app = express();
const port = 4000;

// Parse raw body as text for AWS SNS compatibility
app.use(bodyParser.text({ type: '*/*' }));

// Start HTTP server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Initialize WebSocket server on the same HTTP server
const wss = new WebSocket.Server({ server });

// Send alert to all connected clients
const broadcast = (data) => {
  const json = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
};

// Endpoint to receive SNS messages
app.post('/sns', (req, res) => {
  const snsType = req.headers['x-amz-sns-message-type']; // Type of SNS message
  const body = JSON.parse(req.body); // Convert raw string to object

   // Log URL to confirm subscription
  if (snsType === 'SubscriptionConfirmation') {
    console.log('Confirm the subscription by opening this URL:', body.SubscribeURL);
  }

  if (snsType === 'Notification') {
    const message = {
      Subject: body.Subject || 'No Subject',
      Message: body.Message,
      Timestamp: new Date().toISOString(),
    };

    console.log('New SNS Alert:', message.Subject);
    broadcast(message); // Send alert to frontend via WebSocket
  }

  res.sendStatus(200);
});
