const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Candidates = require('./model/candidateModel');
const uploadController = require('./controller/uploadController');
const path = require('path');

const app = express();
const port = 3000;

// Connect to MongoDB database
mongoose.connect('mongodb://0.0.0.0:27017/candidatesDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error: "));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static("public"));

// Route to render the initial form
app.get('/', (req, res) => {
    res.render('index', { fileUploaded: false });
});

// Configure multer to use memory storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle file upload and processing
app.post('/upload', upload.single('file'), uploadController.processExcelData);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




