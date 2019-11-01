const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');  
// controller for user
const UserController = require('../controllers/users');

// all routes
router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth,  UserController.user_delete);

module.exports = router;