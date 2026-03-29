const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors(
  {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }
));
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./src/routers/auth'));
app.use('/api/subjects', require('./src/routers/subjects'));
app.use('/api/topics', require('./src/routers/topics'));
app.use('/api/tests', require('./src/routers/tests'));
app.use('/api/gemini', require('./src/routers/gemini'));
app.use('/api/dashboard', require('./src/routers/dashboard'));
app.use('/api/roadmap', require('./src/routers/roadmap'));
app.use('/api/documents', require('./src/routers/documents'));
app.use('/api/imagekit', require('./src/routers/imagekit'));
app.use('/api/routine', require('./src/routers/routine'));
app.use('/api/profile', require('./src/routers/profile'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  const errorData = `
--- ERROR OCCURRED ---
Time: ${new Date().toISOString()}
Url: ${req.originalUrl}
Method: ${req.method}
Headers: ${JSON.stringify(req.headers, null, 2)}
Body: ${JSON.stringify(req.body, null, 2)}
Error: ${err.message}
Stack: ${err.stack}
----------------------
`;
  fs.appendFileSync('error.log', errorData);
  console.error('🔥 GLOBAL ERROR HANDLER CATCHED ERROR:', err);
  console.error('   Stack:', err.stack);
  console.error('   Request Payload:', req.body);
  res.status(500).json({ error: 'Internal Server Error', message: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
