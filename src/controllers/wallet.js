const walletService = require('../services/wallet');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const stripe = require("stripe")('sk_test_51OWt0NGObWmLgyNXxqiGtNwgMaN2Ra1BvgozEdBoWM0kIZyEHPPG02Qi2iaYDSW9LSPQ3Ryp0yT6T3iWNRUdwK5j00VvViOl3I');


const getUserWallet = catchAsync(async(req, res)=>{
    const userWallet = await walletService.getWallet(req.query.userId);
    res.status(httpStatus.OK).send(userWallet);
});

const addFunds = catchAsync(async(req, res)=>{
    const {userId, amount} = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        metadata:{userId},
        automatic_payment_methods: {
            enabled: true,
        },
    });
    res.send({clientSecret: paymentIntent.client_secret,})
});

const addFundSuccess = catchAsync(async (req, res)=>{
    const {paymentIntentId, userId} = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if(paymentIntent.status === 'succeeded'){
        const wallet = await walletService.getWallet(userId);
        wallet.balance += paymentIntent.amount / 100;
        await walletService.updateWallet(userId, wallet);
        res.send('Wallet updated successfully');
    }else{
        res.send('Payment not succeeded');
    }
})

module.exports = { 
    getUserWallet,
    addFunds,
    addFundSuccess
}