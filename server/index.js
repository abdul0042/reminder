import express from 'express';
import cors from 'cors';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Resolve dist and public paths using process.cwd()
const rootDir = process.cwd();
const distPath = join(rootDir, 'dist');
const publicPath = join(rootDir, 'public');

console.log('Serving static files from:', distPath);

if (existsSync(distPath)) {
  app.use(express.static(distPath));
}
if (existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Initialize Firebase Admin SDK
let db = null;
try {
  let serviceAccount = null;
  const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else if (existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  } else {
    // Fallback credentials for project: reminder-94d10
    serviceAccount = {
      type: "service_account",
      project_id: "reminder-94d10",
      private_key_id: "633ef42dfbccb0b850b0b8ceca80a23e82f4c4db",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDGJLGdBLyRITBN\nxNxDdFY4Vcjv9UH7XDJ4cJdK/e71b1KedvSwK1RDLBg9PSN19HwIvFmnzcUAajGW\nImR104jYDJ8pKNS0LlD2qZWZ4aIirmp3j0geXt3MqT9KCKnQTHjJe0Tac/YNzRP2\n0K11/8UOYdMSymj3E445bPPJJyQrwo8q0sT1imNYVpvuaRXmf+cq5xrTQ8Q1bsd7\nPRupZ/gg/xDQ2VkBCWmvnQK432DceZt+G2hTbnFqENr4uJBkI84eambGAflBHI8T\nKXOdDzbr5inOBzMQl/pVeR7vG1nJj+8bj8l7qPQaLlop/sm5iNZAU5rI4JyrtnNI\n/aPDgiWFAgMBAAECggEABzqZfEgK9SSH1Z6EBrX820tN7Gs/QANqF/jLnEHNcQjh\ns8RVQwQhq920+K79VzVXPR5aCwQ31r8JFhglICNaj79OIztJH1W9QHKJcbbIqolA\neyIwGGOPpgLau0G7qEzR70/fADVQ2coMm2mbmn19W/v3rmzSDYmaG8A82K7j4/DB\nxS5VO+uIvM18MjtsIVDYHyiA+OQCvW1cUIZ9qmw1dghFt9rkOvXx6twphfcNzNGM\nQf/ftSk73/Hpko8o53uRFmvrxdBIfahbs4r/+oS3qz+ajOEW7yyrRODxB4kLi/ST\n3GvlaNkixD9OI5L65Yqce1bblwMUSzVy6oyMJ0KS4QKBgQDojGOOxJmV0kSR0WX2\nQxpP7hy9PaXqyYGpY+NbN5J0sGm/NVpqOVBsR+8dqo2KFy/Kr2gc9UkSNb/J0Lj3\nxyMkZ5BlSzeMRcSQxmERnKbh8TgPD9lr3EmvaAfto2CDUx3QqT/D7PgFbc/WKaJG\nLrP6Pv/cfrX6xlGYGHq3ZjJTWQKBgQDaIBU64AWcV+Z2fyCit74W3MpaAkrpOIXT\nDHNSEQ7OrtGEjudQqAL8rShyX075JzftVgU7n//JgQARbUzZiO4vqGV+q7cDhqfT\n6VkwsdogF1hdSZ7BSYw818q2HcojxA6QsDlXYoVKLPNMjZJRl7t7U/KIcsfh/8Ki\ncY8pMyf6DQKBgCjI5nUVmfIizI/eb8l+/1BhbHzsIPtKmAkDUc6fsnnwrrswOklD\nAA3dl9xWGzjK1EDx/oqFomklMBvPFYGvVUR/PV3mkTlyywSxJjkWhlY+HhzWJMW7\n/thaoHlXHAgsPaBo7pwIJX+eQMNIzgMNEdej0O/08SmoOos4T912eQERAoGAAysk\nI87NRhAg0OfX2YVBxaM/bT9LR0gC6aXspuyIgogXkw1gXtOR94msZLztsMDZFyGA\nwfT5CjxNe/NSgnZyv0566vQjnHGATpu9J+/tcznjlrdTDwu6dcfMsgiMvyhB7egh\nbRuJRCKTBjGoRnclygzWIRVJwgatFR8BLWAI3KECgYBYHMcZheOor2t2finD4Vly\n6jz4kLw2Z0OmMXTBrfkEkdvFXtbmU819pa9o8xhfv4AEtweNzvfcpeb8o1rmADzD\nqQFD0dfhZhvDeDaQ6Q5YRwDlxI9/5/XOMNHHO+90duXtOeGdZTyBfkPgTJSskwAU\n0pDr5sD8jTYAHbYNbEUt5g==\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-fbsvc@reminder-94d10.iam.gserviceaccount.com"
    };
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount)
    });
  }
  db = getFirestore();
  console.log('Successfully connected to Firebase Firestore (project: reminder-94d10)');
} catch (err) {
  console.error('Error initializing Firebase Admin SDK:', err.message);
}

// Helper: Get collection reference (user-scoped or global)
function getSubCollection(userId) {
  if (!db) return null;
  if (userId) {
    return db.collection('users').doc(userId).collection('subscriptions');
  }
  return db.collection('subscriptions');
}

// Helper: Price normalization
function getNormalizedMonthlyPrice(price, cycle) {
  const p = Number(price) || 0;
  switch (cycle?.toLowerCase()) {
    case 'yearly': return p / 12;
    case 'quarterly': return p / 3;
    case 'weekly': return p * 4.333;
    case 'monthly':
    default: return p;
  }
}

// Helper: Days remaining
function getDaysRemaining(dateStr) {
  if (!dateStr) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

let memoryFallback = [];

// Explicit Root Handler
app.get('/', (req, res) => {
  const indexPath = join(distPath, 'index.html');
  if (existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({
    status: 'online',
    app: 'UnSub REST API Backend',
    database: db ? 'Firebase Firestore (reminder-94d10)' : 'Memory Fallback',
    endpoints: [
      '/api/subscriptions',
      '/api/analytics/monthly-total'
    ]
  });
});

// REST ENDPOINTS

// GET /api/subscriptions
app.get('/api/subscriptions', async (req, res) => {
  const { category, search, sortBy, status, userId } = req.query;

  try {
    let result = [];
    const colRef = getSubCollection(userId);

    if (colRef) {
      const snapshot = await colRef.get();
      snapshot.forEach(doc => {
        result.push({ id: doc.id, ...doc.data() });
      });
    } else {
      result = [...memoryFallback];
    }

    if (status && status !== 'all') {
      result = result.filter(sub => sub.status === status);
    }

    if (category && category !== 'All') {
      result = result.filter(sub => sub.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(sub => 
        sub.serviceName?.toLowerCase().includes(q) ||
        sub.planType?.toLowerCase().includes(q) ||
        sub.category?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'renewal') {
      result.sort((a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => getNormalizedMonthlyPrice(b.price, b.billingCycle) - getNormalizedMonthlyPrice(a.price, a.billingCycle));
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => getNormalizedMonthlyPrice(a.price, a.billingCycle) - getNormalizedMonthlyPrice(b.price, b.billingCycle));
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.serviceName || '').localeCompare(b.serviceName || ''));
    } else {
      result.sort((a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate));
    }

    res.json({
      success: true,
      count: result.length,
      data: result,
      storage: colRef ? 'firestore' : 'memory'
    });
  } catch (err) {
    console.error('GET /api/subscriptions error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/analytics/monthly-total
app.get('/api/analytics/monthly-total', async (req, res) => {
  const { userId } = req.query;

  try {
    let allSubs = [];
    const colRef = getSubCollection(userId);

    if (colRef) {
      const snapshot = await colRef.get();
      snapshot.forEach(doc => allSubs.push({ id: doc.id, ...doc.data() }));
    } else {
      allSubs = [...memoryFallback];
    }

    const activeSubs = allSubs.filter(sub => sub.status === 'active');
    
    let totalMonthlySpend = 0;
    const categoryBreakdown = {};

    activeSubs.forEach(sub => {
      const monthlyCost = getNormalizedMonthlyPrice(sub.price, sub.billingCycle);
      totalMonthlySpend += monthlyCost;

      if (!categoryBreakdown[sub.category]) {
        categoryBreakdown[sub.category] = 0;
      }
      categoryBreakdown[sub.category] += monthlyCost;
    });

    const upcoming7Days = activeSubs.filter(sub => {
      const days = getDaysRemaining(sub.nextBillingDate);
      return days >= 0 && days <= 7;
    }).sort((a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate));

    const topExpenses = [...activeSubs]
      .sort((a, b) => getNormalizedMonthlyPrice(b.price, b.billingCycle) - getNormalizedMonthlyPrice(a.price, a.billingCycle))
      .slice(0, 3);

    res.json({
      success: true,
      data: {
        totalMonthlySpend: Number(totalMonthlySpend.toFixed(2)),
        totalYearlyProjected: Number((totalMonthlySpend * 12).toFixed(2)),
        activeCount: activeSubs.length,
        upcomingCount7Days: upcoming7Days.length,
        upcomingRenewals: upcoming7Days,
        categoryBreakdown,
        topExpenses
      }
    });
  } catch (err) {
    console.error('GET /api/analytics/monthly-total error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/subscriptions
app.post('/api/subscriptions', async (req, res) => {
  const {
    userId,
    serviceName,
    category = 'Entertainment',
    price,
    currency = 'USD',
    billingCycle = 'monthly',
    nextBillingDate,
    planType = 'Standard',
    paymentMethod = '•••• 0205',
    notes = '',
    website = ''
  } = req.body;

  if (!serviceName || price === undefined || !nextBillingDate) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: serviceName, price, nextBillingDate'
    });
  }

  const newSubData = {
    userId: userId || null,
    serviceName,
    category,
    price: Number(price),
    currency,
    billingCycle,
    nextBillingDate,
    planType,
    paymentMethod,
    status: 'active',
    notes,
    website,
    createdAt: new Date().toISOString()
  };

  try {
    let savedSub = null;
    const colRef = getSubCollection(userId);

    if (colRef) {
      const docRef = await colRef.add(newSubData);
      savedSub = { id: docRef.id, ...newSubData };
    } else {
      savedSub = { id: `sub_${Date.now()}`, ...newSubData };
      memoryFallback.unshift(savedSub);
    }

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully in Firestore',
      data: savedSub
    });
  } catch (err) {
    console.error('POST /api/subscriptions error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/subscriptions/:id
app.put('/api/subscriptions/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const updatePayload = { ...req.body, updatedAt: new Date().toISOString() };
  delete updatePayload.id;

  try {
    const colRef = getSubCollection(userId);
    if (colRef) {
      const docRef = colRef.doc(id);
      await docRef.update(updatePayload);
      const updated = await docRef.get();
      res.json({ success: true, message: 'Updated in Firestore', data: { id, ...updated.data() } });
    } else {
      const idx = memoryFallback.findIndex(s => s.id === id);
      if (idx !== -1) memoryFallback[idx] = { ...memoryFallback[idx], ...updatePayload, id };
      res.json({ success: true, message: 'Updated in memory', data: memoryFallback[idx] });
    }
  } catch (err) {
    console.error('PUT /api/subscriptions/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/subscriptions/:id
app.delete('/api/subscriptions/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  try {
    const colRef = getSubCollection(userId);
    if (colRef) {
      await colRef.doc(id).delete();
      res.json({ success: true, message: 'Deleted from Firestore', data: { id } });
    } else {
      const idx = memoryFallback.findIndex(s => s.id === id);
      if (idx !== -1) memoryFallback.splice(idx, 1);
      res.json({ success: true, message: 'Deleted from memory', data: { id } });
    }
  } catch (err) {
    console.error('DELETE /api/subscriptions/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// SPA Fallback for client routing
app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html');
  if (existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({
    status: 'online',
    app: 'UnSub REST API Backend',
    database: db ? 'Firebase Firestore (reminder-94d10)' : 'Memory Fallback',
    endpoints: [
      '/api/subscriptions',
      '/api/analytics/monthly-total'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} with Firebase Firestore connected`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    app.listen(PORT + 1);
  }
});
