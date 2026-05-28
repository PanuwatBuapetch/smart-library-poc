const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/books', (req, res) => {
    res.json([{ id: 1, title: 'Smart Library System', status: 'Available' }]);
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));