// filepath: /d:/coding/DSA-Sprint-HTML/backend/server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2580',
    database: 'binary'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Create table if not exists
db.query(`
    CREATE TABLE IF NOT EXISTS entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        numbers VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err, result) => {
    if (err) throw err;
    console.log('Table created or already exists');
});

// Endpoint to create a binary tree and save the entry
app.post('/api/tree', (req, res) => {
    const numbers = req.body;
    // Here you would create the binary tree (omitted for brevity)
    const treeData = createBinaryTree(numbers); // Assume this function creates the tree

    const numbersStr = numbers.join(',');
    db.query('INSERT INTO entries (numbers) VALUES (?)', [numbersStr], (err, result) => {
        if (err) throw err;
        res.json(treeData);
    });
});

// Endpoint to get all previous entries
app.get('/api/entries', (req, res) => {
    db.query('SELECT * FROM entries ORDER BY createdAt DESC', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

function createBinaryTree(numbers) {
    // Function to create a binary tree from the numbers (implementation omitted)
    return { /* tree data */ };
}