const portfolioService = require('../services/portfolio');
const catchAsync = require ('../utils/catchAsync');
const httpStatus = require('http-status');
const stockService = require('../services/stock');

const getUserPorfolio = catchAsync(async(req, res)=>{
    const userPofolios = await portfolioService.getAllPortfolio(req.query.userId);
    for (const item of userPofolios) {
        const matchStock = await stockService.getStock(item.symbol);
        item.currentPrice = matchStock.open;
    }
    
    console.log(userPofolios)
    res.status(httpStatus.OK).send(userPofolios);
});

module.exports = {
    getUserPorfolio
}
