const Wallet = require('../models/wallet');
const httpStatus = require('http-status');
const apiError = require('../utils/apiError');


const createWallet = async(userId)=>{
    const userWallet = await Wallet.create({userId: userId});
    return userWallet;
};

const getWallet = async(userid)=>{
    const userWallet = await Wallet.findOne({userId: userid});
    if(!userWallet){
        throw new apiError(httpStatus.NOT_FOUND, 'wallet not found');
    }
    return userWallet;
};

const updateWallet = async(userid, updateBody)=>{
    const userWallet = await getWallet(userid);
    if(!userWallet){throw new apiError(httpStatus.NOT_FOUND, 'wallet not found')}
    Object.assign(userWallet, updateBody);
    await userWallet.save();
    return userWallet;
}

module.exports = {
    createWallet,
    getWallet,
    updateWallet
};