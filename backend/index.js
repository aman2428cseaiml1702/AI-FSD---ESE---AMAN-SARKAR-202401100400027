const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/ai', require('./routes/ai'));

// Serve frontend
const fs = require('fs');
if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, '../frontend/dist'))) {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('/*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, '../frontend', 'dist', 'index.html')
        );
    });
} else {
    app.get('/', (req, res) => res.send('API is running...'));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
