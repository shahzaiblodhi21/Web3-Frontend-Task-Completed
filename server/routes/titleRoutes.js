const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/tokenVerify'); // Assuming your middleware is in the middleware folder
const { addTitle, getTitles, editTitle, deleteTitle } = require('../controller/titleController');

// Use verifyToken to authenticate requests
router.post('/add-title', verifyToken, addTitle);
router.get('/get-titles', verifyToken, getTitles);
router.put('/edit-title/:id', verifyToken, editTitle);
router.delete('/delete-title/:id', verifyToken, deleteTitle);

module.exports = router;
