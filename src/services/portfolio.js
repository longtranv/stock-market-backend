const Portfolio = require('../models/portfolio');
const httpStatus = require('http-status');
const apiError = require('../utils/apiError');

const getPortfolio = async(symbol, userid)=>{
    const portfolio = await Portfolio.findOne({symbol: symbol, userId: userid});
    return portfolio;
};

const getAllPortfolio = async(userid)=>{
    const portfolios = await Portfolio.find({userId: userid});
    return portfolios;
}

const createPortfolio = async(userId, symbol, quantity = 0)=>{
    const createdPortfolio = await Portfolio.create({userId: userId, symbol: symbol, quantity: quantity});
    return createdPortfolio;
};

const updatePortfolio = async(userId, symbol, updateBody)=>{
    const portfo = await Portfolio.findOne({userId: userId, symbol: symbol});
    if(!portfo){
        throw new apiError(httpStatus.NOT_FOUND, 'portfolio not found');
    }
    Object.assign(portfo, updateBody);
    await portfo.save();
    return portfo;
}

module.exports = {
    getPortfolio,
    createPortfolio,
    updatePortfolio,
    getAllPortfolio
}