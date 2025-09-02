const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../controllers/authController');
const multer = require('multer');

// For handling resume upload (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

router.post('/login', login);
router.post('/register', upload.single('resume'), register);
router.post('/logout', logout);

module.exports = router;
