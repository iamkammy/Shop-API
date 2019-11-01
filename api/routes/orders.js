const express = require('express');
const router = express.Router();

// middle-ware for authentication 
const checkAuth = require('../middleware/check-auth');

// order-controller
const OrderController = require('../controllers/orders');

router.get('/', checkAuth, OrderController.orders_get_all);

router.post('/', checkAuth, OrderController.create_order);

router.get('/:orderId', checkAuth, OrderController.get_order);

router.delete('/:orderId', checkAuth, OrderController.delete_order);


module.exports = router;