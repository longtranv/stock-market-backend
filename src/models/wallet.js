const mongoose = require('mongoose');

// Define the User's Wallet Schema
const UserWalletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    balance: {
        type: Number,
        default: 0 // Initial balance for the user's wallet
    },
    currency: {
        type: String,
        default: 'USD'
    }
});

// Create and export the UserWallet model
const UserWallet = mongoose.model('UserWallet', UserWalletSchema);
module.exports = UserWallet;