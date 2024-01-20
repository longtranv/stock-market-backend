const express = require('express');
const stockController = require('../controllers/stock');
const orderController = require('../controllers/order');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const walletController = require('../controllers/wallet');
const portfolioController = require('../controllers/portfolio')
const validate = require('../middlewares/validate')
const authValidation = require('../validatations/auth.validation');
const userValidation = require('../validatations/user.validation');
const auth = require('../middlewares/auth');


const router = express.Router();


router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

router
  .route('/user')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/user/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);






router
    .route('/stock')
    .get(stockController.getStock)

router.post('/insertstock',auth('insertStock'),stockController.insertStocks);

router.get('/stocklist', stockController.getStocks);
router.get('/changelist', stockController.getStockChange);

router.post('/order',auth(), orderController.createOrder);
router.post('/cancel-order', auth(), orderController.cancelOrder);
router.post('/broker', auth('manageUsers'), userController.createBroker);
router.post('/add-funds',auth(), walletController.addFunds)
router.route('/addfund-success').post(walletController.addFundSuccess);
router.get('/wallet',auth(), walletController.getUserWallet);
router.get('/asset',auth(), portfolioController.getUserPorfolio);
router.get('/orderlist',auth(), orderController.getOrders);




module.exports = router;

