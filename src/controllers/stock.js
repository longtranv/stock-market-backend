const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const StockService = require('../services/stock');

const insertStocks = catchAsync(async (req, res)=>{
    const stocks = await StockService.insertNewDayStocks(req.body);
    res.status(httpStatus.CREATED).send(stocks);
});

const createNewStock = catchAsync(async (req, res)=>{
    const stock = await StockService.createStock(req.body)
    res.status(httpStatus.CREATED).send(stock)
});

const getStocks = catchAsync(async (req, res)=>{
    const result = await StockService.getAllStocks();
    res.send(result);
})

const getStock = catchAsync(async(req, res)=>{
    const stockSeries = await StockService.queryStock(req.body.symbol);
    res.status(httpStatus.OK).send(stockSeries);
})

module.exports = {
    insertStocks,
    createNewStock,
    getStocks,
    getStock
}