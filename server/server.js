import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health Check endpoint for Render
app.get('/', (req, res) => {
  res.json({
    service: "Lion's Den 3D Production API",
    status: 'HEALTHY',
    version: '1.0.0',
    currency: 'GHS',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Telemetry & Info
app.get('/api/info', (req, res) => {
  res.json({
    studio: "Lion's Den 3D",
    location: "Accra, Ghana",
    currency: "GHS",
    capabilities: ["SLA", "FDM", "SLS", "Full-Color Resin"],
    status: "ONLINE"
  });
});

// Clerk Webhook receiver stub (for user synchronization)
app.post('/api/webhooks/clerk', (req, res) => {
  const event = req.body;
  console.log('Received Clerk webhook:', event?.type);
  res.status(200).json({ received: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🦁 Lion's Den 3D Server listening on port ${PORT}`);
});
