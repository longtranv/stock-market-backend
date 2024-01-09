const express = require('express');
const mongoose = require('mongoose');
const stockController = require('../controllers/stock')
const orderController = require('../controllers/order');
const authController = require('../controllers/auth')
const userController = require('../controllers/user')

const router = express.Router();


router.post('/register', authController.register);

router
    .route('/stock')
    .get(stockController.getStock)
    .post(stockController.createNewStock);

router.route('/insertstock').post(stockController.insertStocks);

router.route('/order').post(orderController.createOrder);
router.route('/broker').post(userController.createBroker)



module.exports = router;

