const portfolioService = require('../services/portfolio');
const catchAsync = require ('../utils/catchAsync');
const httpStatus = require('http-status');

const getUserPorfolio = catchAsync(async(req, res)=>{
    const userPofolios = await portfolioService.getAllPortfolio(req.body.userId);
    res.status(httpStatus.OK).send(userPofolios);
});

module.exports = getUserPorfolio;
