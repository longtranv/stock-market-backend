const Portfolio = require('../models/portfolio');
const httpStatus = require('http-status');
const apiError = require('../utils/apiError');

const getPortfolio = async(symbol, userid)=>{
    const portfolio = await Portfolio.findOne({symbol: symbol, userId: userid});
    return portfolio;
};

const createPortfolio = async(userId, symbol)=>{
    const createdPortfolio = await Portfolio.create({userId: userId, symbol: symbol});
    return createdPortfolio;
};

const updatePortfolio = async(userId, symbol, quantity, currentPrice)=>{
    const portfo = await Portfolio.findOne({userId: userId, symbol: symbol});
    if(!portfo){
        throw new apiError(httpStatus.NOT_FOUND, 'portfolio not found');
    }

}

module.exports = {
    getPortfolio
}